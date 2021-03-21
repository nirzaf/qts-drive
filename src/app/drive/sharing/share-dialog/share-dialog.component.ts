import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofActionDispatched, Select, Store } from '@ngxs/store';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { DRIVE_ENTRY_FULL_PERMISSIONS, DriveEntryPermissions } from '../../permissions/drive-entry-permissions';
import { ResetState, SetInitialUsers, ShareDialogState, ShareEntries, ShareEntriesFailed } from '../state/share-dialog.state';
import { FormControl } from '@angular/forms';
import { BackendErrorMessages } from '@common/core/types/backend-error-response';
import { map, takeUntil } from 'rxjs/operators';
import { Users } from '@common/auth/users.service';
import { Settings } from '@common/core/config/settings.service';

@Component({
    selector: 'share-dialog',
    templateUrl: './share-dialog.component.html',
    styleUrls: ['./share-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareDialogComponent implements OnDestroy {
    @Select(ShareDialogState.loading) loading$: Observable<boolean>;

    private destroyed$ = new Subject();
    public errors: BehaviorSubject<BackendErrorMessages> = new BehaviorSubject({});
    public shareModel: { emails: FormControl, permissions: DriveEntryPermissions};

    constructor(
        public dialogRef: MatDialogRef<ShareDialogComponent>,
        public settings: Settings,
        private store: Store,
        private actions$: Actions,
        private users: Users,
    ) {
        this.resetModel();
        this.store.dispatch(new SetInitialUsers());

        this.bindToShareError();
        this.bindToShareModel();
    }

    ngOnDestroy() {
        this.store.dispatch(new ResetState());
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    public share() {
        const payload = {
            emails: this.shareModel.emails.value,
            permissions: this.shareModel.permissions,
        };

        this.store.dispatch(new ShareEntries(payload)).subscribe(() => {
            this.setErrorMessages();
            this.resetModel();
        });
    }

    private resetModel() {
        this.shareModel = {
            emails: new FormControl([]),
            permissions: DRIVE_ENTRY_FULL_PERMISSIONS
        };
    }

    private setErrorMessages(messages?: BackendErrorMessages) {
        this.errors.next(messages || {});
    }

    private bindToShareModel() {
        this.shareModel.emails.valueChanges
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => this.setErrorMessages());
    }

    private bindToShareError() {
        this.actions$.pipe(
            takeUntil(this.destroyed$),
            ofActionDispatched(ShareEntriesFailed)
        ).subscribe((action: ShareEntriesFailed) => {
            this.setErrorMessages(action.messages);
        });
    }

    suggestUserEmails = (query: string): Observable<string[]> => {
        return this.users.getAll({query, perPage: 7})
            .pipe(map(users => users.map(u => u.email)));
    }
}
