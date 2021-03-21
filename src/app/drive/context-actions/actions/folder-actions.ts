import { OpenDialog, } from '../../state/actions/commands';
import { Injectable } from '@angular/core';
import { DriveContextActions } from '../drive-context-actions';
import { CrupdateFolderDialogComponent } from '../../folders/components/crupdate-folder-dialog/crupdate-folder-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class FolderActions extends DriveContextActions {
    protected actions = [
        {
            viewName: 'New Folder',
            icon: 'create-new-folder',
            execute: () => {
                this.store.dispatch(new OpenDialog(CrupdateFolderDialogComponent));
            },
            visible: () => this.hasPermission('files.create'),
        },
        {
            viewName: 'Upload Files',
            icon: 'cloud-upload',
            separatorBefore: true,
            execute: () => {
                this.openUploadWindow('file');
            },
            visible: () => this.hasPermission('files.create'),
        },
        {
            viewName: 'Upload Folder',
            icon: 'upload-folder-custom',
            execute: () => {
                this.openUploadWindow('directory');
            },
            visible: () => this.hasPermission('files.create'),
        },
    ];
}
