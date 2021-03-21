import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    Output,
    ViewEncapsulation
} from '@angular/core';
import {
    DRIVE_ENTRY_FULL_PERMISSIONS, DriveEntryPermissions
} from '../../permissions/drive-entry-permissions';
import { ShareDialogEntryPermissions } from '../share-dialog/types/ShareDialogEntryPermissions';
import { Select, Store } from '@ngxs/store';
import { SharesApiService } from '../shares-api.service';
import { Toast } from '../../../../common/core/ui/toast.service';
import {
    ShareDialogEntryUser, ShareDialogState, UpdateUserPermissions
} from '../state/share-dialog.state';
import { Observable } from 'rxjs';

@Component({
    selector: 'sharing-permissions-button',
    templateUrl: './sharing-permissions-button.component.html',
    styleUrls: ['./sharing-permissions-button.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharingPermissionsButtonComponent {
    @Input() permissions: ShareDialogEntryPermissions = DRIVE_ENTRY_FULL_PERMISSIONS;
    @Input() user: ShareDialogEntryUser;
    @Output() change: EventEmitter<DriveEntryPermissions> = new EventEmitter();
    @Input() @HostBinding('class.compact') compact = false;
    @Select(ShareDialogState.loadingUsers) loadingUsers$: Observable<number[]>;

    constructor(
        private store: Store,
        private api: SharesApiService,
        private toast: Toast,
    ) {}

    public overallPermission(): keyof ShareDialogEntryPermissions {
        if (this.permissions.varies) {
            return 'varies';
        } else if (this.permissions.edit) {
            return 'edit';
        } else if (this.permissions.download) {
            return 'download';
        } else {
            return 'view';
        }
    }

    public selectPermission(permission: keyof ShareDialogEntryPermissions) {
        if (permission === 'edit') {
            this.permissions = {...DRIVE_ENTRY_FULL_PERMISSIONS};
        } else if (permission === 'download') {
            this.permissions = {...DRIVE_ENTRY_FULL_PERMISSIONS, edit: false};
        } else {
            this.permissions = {...DRIVE_ENTRY_FULL_PERMISSIONS, edit: false, download: false};
        }

        if (this.user) {
            this.updateUserPermissions(this.permissions);
        } else {
            this.change.emit(this.permissions);
        }
    }

    public updateUserPermissions(newPermissions: DriveEntryPermissions) {
        this.store.dispatch(new UpdateUserPermissions(this.user, newPermissions))
            .subscribe(() => {
                this.toast.open('Changed permissions.');
            });
    }
}
