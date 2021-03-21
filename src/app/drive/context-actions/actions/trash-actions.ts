import { DeleteTrashedEntriesForever, OpenConfirmDialog, RestoreTrashedEntries, } from '../../state/actions/commands';
import { Injectable } from '@angular/core';
import { DriveContextActions } from '../drive-context-actions';

@Injectable({
    providedIn: 'root'
})
export class TrashActions extends DriveContextActions {
    protected actions = [
        {
            viewName: 'Restore',
            icon: 'restore',
            showInCompact: true,
            execute: () => {
                this.store.dispatch(new RestoreTrashedEntries());
            },
            visible: () => this.hasPermission('files.update'),
        },
        {
            viewName: 'Delete Forever',
            icon: 'delete-forever',
            showInCompact: true,
            execute: () => {
                this.deleteForever();
            },
            visible: () => this.hasPermission('files.delete'),
        },
    ];

    public deleteForever() {
        this.store.dispatch(new OpenConfirmDialog({
            title: 'Delete Forever',
            body: 'This will permanently delete selected items.',
            bodyBold: 'This action can not be undone.',
            ok: 'Delete Forever',
        }, new DeleteTrashedEntriesForever()));
    }
}
