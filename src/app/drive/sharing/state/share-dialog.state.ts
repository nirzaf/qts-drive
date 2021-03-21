import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { DriveState } from '../../state/drive-state';
import { DriveEntryUser } from '../../files/models/drive-entry';
import { DriveEntryPermissions } from '../../permissions/drive-entry-permissions';
import { finalize, tap } from 'rxjs/operators';
import { SharesApiService } from '../shares-api.service';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import uniqBy from 'lodash/uniqBy';
import {
    BackendErrorMessages, BackendErrorResponse
} from '@common/core/types/backend-error-response';
import { ShareDialogEntryPermissions } from '../share-dialog/types/ShareDialogEntryPermissions';
import { UpdateEntries } from '../../state/actions/commands';
import { Injectable } from '@angular/core';

export class SetInitialUsers {
    static readonly type = '[ShareDialog] Set Initial Users';
}

export class UpdateUserPermissions {
    static readonly type = '[ShareDialog] Update User Permissions';
    constructor(public user: DriveEntryUser, public permissions: DriveEntryPermissions) {}
}

export class RemoveUser {
    static readonly type = '[ShareDialog] Remove User';
    constructor(public user: DriveEntryUser) {}
}

export class SetUsers {
    static readonly type = '[ShareDialog] Set Users';
    constructor(public users: DriveEntryUser[]) {}
}

export class ResetState {
    static readonly type = '[ShareDialog] Reset';
}

export class ShareEntries {
    static readonly type = '[ShareDialog] Share Entries';
    constructor(public payload: {emails: string[], permissions: DriveEntryPermissions}) {}
}

export class ShareEntriesFailed {
    static readonly type = '[ShareDialog] Share Entries Failed';
    constructor(public messages: BackendErrorMessages) {}
}

export interface ShareDialogEntryUser extends DriveEntryUser {
    removed?: boolean;
    entry_permissions: ShareDialogEntryPermissions;
}

export interface ShareDialogStateModel {
    loading: boolean;
    loadingUsers: number[];
    original: ShareDialogEntryUser[];
    usersWithAccess: ShareDialogEntryUser[];
}

@State<ShareDialogStateModel>({
    name: 'shareDialog',
    defaults: {
        usersWithAccess: [],
        original: [],
        loading: false,
        loadingUsers: [],
    }
})
@Injectable()
export class ShareDialogState {
    constructor(
        private store: Store,
        private sharesApi: SharesApiService
    ) {}

    @Selector()
    static usersWithAccess(state: ShareDialogStateModel) {
        return state.usersWithAccess;
    }

    @Selector()
    static dirty(state: ShareDialogStateModel) {
        return !isEqual(state.original, state.usersWithAccess);
    }

    @Selector()
    static loading(state: ShareDialogStateModel) {
        return state.loading;
    }

    @Selector()
    static loadingUsers(state: ShareDialogStateModel) {
        return state.loadingUsers;
    }

    @Action(SetInitialUsers)
    setInitialUsers(ctx: StateContext<ShareDialogStateModel>) {
        const entries = this.store.selectSnapshot(DriveState.selectedEntries);

        let users = entries
            .map(entry => entry.users)
            .reduce((all, curr) => all.concat(curr), []);

        // make sure we don't override anything in main drive store
        users = cloneDeep(users);
        users = users.filter(user => !!user);

        // multiple entries might contain same users
        const uniqueUsers = uniqBy(users, user => user.id) as ShareDialogEntryUser[];

        // if permissions for same user are not same on
        // all selected entries, show "varies" permission
        if (entries.length > 1) {
            uniqueUsers.forEach(user => {
                const permissions = entries
                    .map(entry => entry.users.find(u => u.id === user.id))
                    .filter(u => !!u)
                    .map(u => Object.assign({}, u.entry_permissions));

                if (entries.length !== permissions.length || permissions.some(p => !isEqual(p, permissions[0]))) {
                    user.entry_permissions = {varies: true};
                }
            });
        }

        ctx.patchState({
            usersWithAccess: cloneDeep(uniqueUsers),
            original: uniqueUsers,
        });
    }

    @Action(SetUsers)
    setUsers(ctx: StateContext<ShareDialogStateModel>, action: SetUsers) {
        ctx.patchState({
            usersWithAccess: action.users,
            original: cloneDeep(action.users)
        });
    }

    @Action(UpdateUserPermissions)
    updateUserPermissions(ctx: StateContext<ShareDialogStateModel>, action: UpdateUserPermissions) {
        this.toggleUserLoading(ctx, action.user.id, true);
        const entryIds = this.store.selectSnapshot(DriveState.selectedEntries).map(e => e.id);
        const userId = action.user.id;
        return this.sharesApi.changePermissions(userId, entryIds, action.permissions).pipe(
            finalize(() => this.toggleUserLoading(ctx, action.user.id, false)),
            tap(response => this.updateUsers(ctx, response.users))
        );
    }

    @Action(RemoveUser)
    removeUser(ctx: StateContext<ShareDialogStateModel>, action: RemoveUser) {
        this.toggleUserLoading(ctx, action.user.id, true);
        return this.sharesApi.detachUser(
            action.user.id,
            this.store.selectSnapshot(DriveState.selectedEntries).map(e => e.id)
        ).pipe(
            finalize(() => this.toggleUserLoading(ctx, action.user.id, false)),
            tap(response => this.updateUsers(ctx, response.users))
        );
    }

    @Action(ResetState)
    resetState(ctx: StateContext<ShareDialogStateModel>) {
       ctx.setState({
           loading: false,
           usersWithAccess: [],
           original: [],
           loadingUsers: [],
       });
    }

    @Action(ShareEntries, {cancelUncompleted: true})
    shareEntries(ctx: StateContext<ShareDialogStateModel>, action: ShareEntries) {
        ctx.patchState({loading: true});

        const payload = {
            ...action.payload,
            entries: this.store.selectSnapshot(DriveState.selectedEntries)
        };

        return this.sharesApi.shareEntries(payload)
            .pipe(
                finalize(() => ctx.patchState({loading: false})),
                tap(response => {
                    ctx.dispatch(new SetUsers(response.users));
                    this.updateEntriesInDriveStore(response.users);
                }, (errorResponse: BackendErrorResponse) => {
                    ctx.dispatch(new ShareEntriesFailed(errorResponse.errors));
                })
            );
    }

    private toggleUserLoading(ctx: StateContext<ShareDialogStateModel>, userId: number, isLoading: boolean) {
        if (isLoading) {
            ctx.patchState({loadingUsers: [...ctx.getState().loadingUsers, userId]});
        } else {
            ctx.patchState({loadingUsers: ctx.getState().loadingUsers.filter(u => u !== userId)});
        }
    }

    private updateUsers(ctx, newUsers: DriveEntryUser[]) {
        ctx.patchState({
            usersWithAccess: newUsers,
            original: cloneDeep(newUsers),
        });
        this.updateEntriesInDriveStore(newUsers);
    }

    private updateEntriesInDriveStore(newUsers: DriveEntryUser[]) {
        const entries = this.store.selectSnapshot(DriveState.selectedEntries);

        // update permissions in main drive store, otherwise we'll get old
        // permissions if user re-opens share dialog without page reload
        const updatedEntries = entries.map(entry => {
            entry.users = newUsers;
            return entry;
        });

        this.store.dispatch(new UpdateEntries(updatedEntries));
    }
}
