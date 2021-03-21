import {
    AddStar,
    CopySelectedEntries,
    DeleteSelectedEntries,
    DownloadEntries,
    OpenDialog,
    OpenFilePreview,
    RemoveStar
} from '../../state/actions/commands';
import { ShareDialogComponent } from '../../sharing/share-dialog/share-dialog.component';
import { ShareLinkDialogComponent } from '../../sharing/share-link-dialog/share-link-dialog.component';
import { CrupdateFolderDialogComponent } from '../../folders/components/crupdate-folder-dialog/crupdate-folder-dialog.component';
import { Injectable } from '@angular/core';
import { MoveEntriesDialogComponent } from '../../entries/move-entries-dialog/move-entries-dialog.component';
import { RenameEntryDialogComponent } from '../../entries/rename-entry-dialog/rename-entry-dialog.component';
import { DriveContextActions } from '../drive-context-actions';
import { DriveState } from '../../state/drive-state';

@Injectable({
    providedIn: 'root'
})
export class EntryActions extends DriveContextActions {
    protected actions = [
        {
            viewName: 'Preview',
            icon: 'visibility',
            showInCompact: true,
            execute: () => {
                this.store.dispatch(new OpenFilePreview());
            },
            visible: () => {
                return !this.onlyFoldersSelected;
            },
        },
        {
            viewName: 'Manage People',
            icon: 'person-add',
            showInCompact: true,
            execute: () => {
                this.store.dispatch(new OpenDialog(ShareDialogComponent));
            },
            visible: () => this.hasPermission('files.update'),
        },
        {
            viewName: 'Get shareable link',
            icon: 'link',
            execute: () => {
                this.store.dispatch(new OpenDialog(ShareLinkDialogComponent, null, {
                    panelClass: 'share-link-dialog-container',
                    autoFocus: false,
                }));
            },
            visible: () => !this.multipleEntriesSelected && this.hasPermission('files.update'),
        },
        {
            viewName: 'Add a star',
            icon: 'star',
            execute: () => {
                this.store.dispatch(new AddStar(this.getSelectedEntries()));
            },
            visible: () => !this.allStarred
        },
        {
            viewName: 'Remove star',
            icon: 'star-border',
            execute: () => {
                this.store.dispatch(new RemoveStar(this.getSelectedEntries()));
            },
            visible: () => this.allStarred
        },
        {
            viewName: 'New Folder',
            icon: 'create-new-folder',
            separatorBefore: this.store.selectSnapshot(DriveState.isMobile),
            execute: () => {
                this.store.dispatch(new OpenDialog(CrupdateFolderDialogComponent, {folder: this.getSelectedFolder()}));
            },
            visible: () => this.hasPermission('files.create')
        },
        {
            viewName: 'Upload Files',
            icon: 'cloud-upload',
            execute: () => {
                this.openUploadWindow('file');
            },
            visible: () => this.hasPermission('files.create') && this.store.selectSnapshot(DriveState.isMobile),
        },
        {
            viewName: 'Upload Folder',
            icon: 'upload-folder-custom',
            execute: () => {
                this.openUploadWindow('directory');
            },
            visible: () => this.hasPermission('files.create') && this.store.selectSnapshot(DriveState.isMobile),
        },
        {
            viewName: 'Move to',
            icon: 'subdirectory-arrow-right',
            separatorBefore: this.store.selectSnapshot(DriveState.isMobile),
            execute: () => {
                this.store.dispatch(new OpenDialog(MoveEntriesDialogComponent, null, {panelClass: 'move-entries-dialog-container'}));
            },
            visible: () => this.hasPermission('files.update'),
        },
        {
            viewName: 'Rename',
            icon: 'edit',
            execute: () => {
                this.store.dispatch(new OpenDialog(RenameEntryDialogComponent));
            },
            visible: () => {
                return !this.multipleEntriesSelected && this.hasPermission('files.update');
            }
        },
        {
            viewName: 'Make a copy',
            icon: 'file-copy',
            execute: () => {
                this.store.dispatch(new CopySelectedEntries());
            },
            visible: () => this.hasPermission('files.create'),
        },
        {
            viewName: 'Download',
            icon: 'file-download',
            execute: () => {
                this.store.dispatch(new DownloadEntries());
            },
            visible: () => this.hasPermission('files.download'),
        },
        {
            viewName: 'Delete',
            icon: 'delete',
            showInCompact: true,
            separatorBefore: true,
            execute: () => {
                this.store.dispatch(new DeleteSelectedEntries());
            },
            visible: () => this.hasPermission('files.delete'),
        },
    ];
}
