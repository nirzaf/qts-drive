import {
    CopySelectedEntries, DownloadEntries, OpenDialog, OpenFilePreview, RemoveEntries,
} from '../../state/actions/commands';
import { Injectable } from '@angular/core';
import { DriveContextActions } from '../drive-context-actions';
import { ShareLinkDialogComponent } from '../../sharing/share-link-dialog/share-link-dialog.component';
import { Store } from '@ngxs/store';
import { CurrentUser } from '@common/auth/current-user';
import { SharesApiService } from '../../sharing/shares-api.service';
import { ShareDialogComponent } from '../../sharing/share-dialog/share-dialog.component';
import { RenameEntryDialogComponent } from '../../entries/rename-entry-dialog/rename-entry-dialog.component';
import { WorkspacesService } from '../../../../common/workspaces/workspaces.service';

const noopTrue = () => true;

@Injectable({
    providedIn: 'root'
})
export class SharesActions extends DriveContextActions {
    protected actions = [
        {
            viewName: 'Preview',
            icon: 'visibility',
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
            visible: () => {
                return this.hasPermission('files.update');
            },
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
            visible: () => {
                return !this.multipleEntriesSelected && this.hasPermission('files.update');
            }
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
            visible: () => {
                return this.hasPermission('files.download') && this.hasPermission('files.create');
            },
        },
        {
            viewName: 'Download',
            icon: 'file-download',
            execute: () => {
                this.store.dispatch(new DownloadEntries());
            },
            visible: () => {
                return this.hasPermission('files.download');
            },
        },
        {
            viewName: 'Remove',
            icon: 'delete',
            showInCompact: true,
            execute: () => {
                const entries = this.getSelectedEntries();
                this.shares.detachUser(
                    this.currentUser.get('id'),
                    entries.map(e => e.id),
                ).subscribe(() => {
                    this.store.dispatch(new RemoveEntries(entries));
                });
            },
            visible: noopTrue,
        },
    ];

    constructor(
        protected store: Store,
        protected currentUser: CurrentUser,
        protected shares: SharesApiService,
        protected workspaces: WorkspacesService
    ) {
        super(store, workspaces, currentUser);
    }
}
