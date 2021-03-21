import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DriveEntryUser } from '../../files/models/drive-entry';
import {
    RemoveUser, ShareDialogEntryUser, ShareDialogState
} from '../state/share-dialog.state';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CurrentUser } from '../../../../common/auth/current-user';
import { WorkspacesService } from '../../../../common/workspaces/workspaces.service';
import { DriveState } from '../../state/drive-state';
import { filter, map, switchMap } from 'rxjs/operators';

@Component({
    selector: 'entries-access-table',
    templateUrl: './entries-access-table.component.html',
    styleUrls: ['./entries-access-table.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('flyInOut', [
            state('in', style({transform: 'translateX(0)'})),
            transition('void => *', [
                style({transform: 'translateX(-100%)'}),
                animate(100)
            ]),
            transition('* => void', [
                animate(100, style({transform: 'translateX(100%)'}))
            ])
        ])
    ]
})
export class EntriesAccessTableComponent {
    @Select(ShareDialogState.usersWithAccess) users: Observable<ShareDialogEntryUser[]>;
    @Select(ShareDialogState.loadingUsers) loadingUsers$: Observable<number[]>;
    public activeWorkspace$ = this.store.select(DriveState.selectedEntries)
        .pipe(
            map(entries => entries.every(e => e.workspace_id)),
            filter(x => !!x),
            switchMap(() => this.workspaces.activeWorkspace$)
        );

    constructor(
        private store: Store,
        public currentUser: CurrentUser,
        public workspaces: WorkspacesService,
    ) {}

    public removeUser(user: DriveEntryUser) {
        this.store.dispatch(new RemoveUser(user));
    }

    trackByUser(index: number, user: DriveEntryUser): number { return user.id; }
}
