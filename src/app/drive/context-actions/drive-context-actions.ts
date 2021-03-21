import { Store } from '@ngxs/store';
import { DriveState } from '../state/drive-state';
import { DriveContextAction } from './types/drive-context-action';
import { Injectable } from '@angular/core';
import { WorkspacesService } from '../../../common/workspaces/workspaces.service';
import { OpenUploadWindow } from '../state/actions/commands';
import { CurrentUser } from '../../../common/auth/current-user';
import { DriveFolder } from '../folders/models/driveFolder';

@Injectable({
    providedIn: 'root'
})
export abstract class DriveContextActions {
    protected multipleEntriesSelected: boolean;
    protected allStarred: boolean;
    protected onlyFoldersSelected: boolean;

    protected abstract actions: DriveContextAction[];

    constructor(
        protected store: Store,
        protected workspaces: WorkspacesService,
        protected currentUser: CurrentUser,
    ) {}

    public getActions() {
        this.updateStatus();
        return this.actions;
    }

    protected getSelectedEntries() {
        return this.store.selectSnapshot(DriveState.selectedEntries);
    }

    protected updateStatus() {
        this.multipleEntriesSelected = this.store.selectSnapshot(DriveState.multipleEntriesSelected);
        this.allStarred = this.store.selectSnapshot(DriveState.allSelectedEntriesStarred);
        this.onlyFoldersSelected = this.store.selectSnapshot(DriveState.onlyFoldersSelected);
    }

    protected hasPermission(permission: string): boolean {
        if (permission === 'files.create') {
            const activeFolder = this.store.selectSnapshot(DriveState.activePage).folder;

            // upload either to the folder user right clicked on or the folder that is currently open
            const target = (!this.multipleEntriesSelected && this.getSelectedFolder()) || activeFolder;
            return (target?.permissions || [])['files.update'];
        } else {
            return this.getSelectedEntries().every(entry => {
                return entry.permissions[permission];
            });
        }
    }

    protected getSelectedFolder(): DriveFolder {
        return this.getSelectedEntries().find(f => f.type === 'folder') as DriveFolder;
    }

    protected openUploadWindow(type: 'file'|'directory') {
        this.store.dispatch(new OpenUploadWindow(type));
    }
}
