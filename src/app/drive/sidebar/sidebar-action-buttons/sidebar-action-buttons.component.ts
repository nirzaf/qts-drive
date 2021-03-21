import { Component, ViewEncapsulation, ChangeDetectionStrategy, Inject } from '@angular/core';
import { Modal } from '@common/core/ui/dialogs/modal.service';
import { CrupdateFolderDialogComponent } from '../../folders/components/crupdate-folder-dialog/crupdate-folder-dialog.component';
import { Select, Store } from '@ngxs/store';
import { UploadFiles } from '../../state/actions/commands';
import { UploadedFile } from '@common/uploads/uploaded-file';
import { UploadInputConfig } from '@common/uploads/upload-input-config';
import { DriveState } from '../../state/drive-state';
import { Observable } from 'rxjs';
import { DRIVE_UPLOAD_INPUT_CONFIG } from '../../upload-input-config';

@Component({
    selector: 'sidebar-action-buttons',
    templateUrl: './sidebar-action-buttons.component.html',
    styleUrls: ['./sidebar-action-buttons.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarActionButtonsComponent {
    @Select(DriveState.canUpload) canUpload$: Observable<boolean>;

    constructor(
        private dialog: Modal,
        private store: Store,
        @Inject(DRIVE_UPLOAD_INPUT_CONFIG) public uploadInputConfig: UploadInputConfig,
    ) {}

    public openNewFolderDialog() {
        this.dialog.open(CrupdateFolderDialogComponent);
    }

    public openUploadsPanel(files: UploadedFile[]) {
        this.store.dispatch(new UploadFiles(files));
    }
}
