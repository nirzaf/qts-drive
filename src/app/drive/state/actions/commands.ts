import { DriveFolder } from '../../folders/models/driveFolder';
import { DriveEntry } from '../../files/models/drive-entry';
import { ConfirmModalData } from '@common/core/ui/confirm-modal/confirm-modal.component';
import { ComponentType } from '@angular/cdk/portal';
import { UploadedFile } from '@common/uploads/uploaded-file';
import { SortColumn, SortDirection } from '../../entries/available-sorts';
import { LoadEntriesAction } from './events';
import { DriveApiIndexParams } from '../../drive-entry-api.service';
import { FileEntry } from '@common/uploads/types/file-entry';
import { ShareableLink } from '../../sharing/links/models/shareable-link';
import { MatDialogConfig } from '@angular/material/dialog';
import { User } from '../../../../common/core/types/models/User';
import { Workspace } from '../../../../common/workspaces/types/workspace';
import { DrivePage } from '../models/drive-page';

export class LoadUserFolders {
    static readonly type = '[Drive] Load User Folders';
}

export class LoadUserSpaceUsage {
    static readonly type = '[Drive] Load User Space Usage';
}

export class BuildFolderTree {
    static readonly type = '[Drive] Build Folder Tree';
    constructor(public folders?: DriveFolder[]) {}
}

export class OpenFolder {
    static readonly type = '[Drive] Open Folder';
    constructor(public folder?: DriveFolder) {}
}

export class OpenSearchPage {
    static readonly type = '[Drive] Open Search Page';
    constructor(public queryParams: {
        type?: string,
        query?: string,
    }) {}
}

export class SelectEntries {
    static readonly type = '[Drive] Select Entries';
    constructor(public entries: DriveEntry[]) {}
}

export class SelectAllEntries {
    static readonly type = '[Drive] Select All Entries';
}

export class DeselectAllEntries {
    static readonly type = '[Drive] Deselect All Entries';
}

export class DeleteSelectedEntries {
    static readonly type = '[Drive] Delete Selected Entries';
}

export class OpenUploadsPanel {
    static readonly type = '[Drive] Open UploadsApiService Panel';
}

export class CloseUploadsPanel {
    static readonly type = '[Drive] Close UploadsApiService Panel';
}

export class AddEntries {
    static readonly type = '[Drive] Add Entries';
    constructor(public entries: DriveEntry[]) {}
}

export class MoveEntries {
    static readonly type = '[Drive API] Move Entries';
    constructor(public destination: DriveFolder, public entries?: DriveEntry[]) {}
}

export class OpenDialog {
    static readonly type = '[Drive] Open Dialog';
    constructor(public dialog: ComponentType<any>, public data?: object, public config?: MatDialogConfig) {}
}

export class OpenConfirmDialog {
    static readonly type = '[Drive] Open Confirm Dialog';
    constructor(public data: ConfirmModalData, public confirmAction: any) {}
}

export class SetViewMode {
    static readonly type = '[Drive] Set View Mode';
    constructor(public mode: 'list'|'grid') {}
}

export class ToggleDetailsSidebar {
    static readonly type = '[Drive] Toggle Details';
}

export class ToggleSidebar {
    static readonly type = '[Drive] Toggle Sidebar';
}

export class UploadFiles {
    static readonly type = '[Drive] Upload Files';
    constructor(public files: UploadedFile[]) {}
}

export class RestoreTrashedEntries {
    static readonly type = '[Drive] Restore Trashed Entries';
    constructor(public entries?: DriveEntry[]) {}
}

export class DeleteTrashedEntriesForever {
    static readonly type = '[Drive] Delete Trashed Entries Forever';
}

export class EmptyTrash {
    static readonly type = '[Drive] Empty Trash';
}

export class OpenFilePreview {
    static readonly type = '[Drive] Open File Preview Overlay';
    constructor(public entries?: DriveEntry[]) {}
}

export class DownloadEntries {
    static readonly type = '[Drive] Download Files';
    constructor(public entries?: FileEntry[], public link?: ShareableLink, public password?: string) {}
}

export class AddStar {
    static readonly type = '[Drive] Add a Star';
    constructor(public entries: DriveEntry[]) {}
}

export class RemoveStar {
    static readonly type = '[Drive] Remove Star';
    constructor(public entries: DriveEntry[]) {}
}

export class RemoveEntries {
    static readonly type = '[Drive] Remove Entries';
    constructor(public entries: DriveEntry[]) {}
}

export class ChangeSort {
    static readonly type = '[Drive] Change Sort';
    constructor(public sort: SortColumn, public direction: SortDirection = 'desc') {}
}

export class LoadMoreEntries implements LoadEntriesAction {
    static readonly type = '[Drive Infinite Scroll] Load More Entries';
    public loadMore = true;
    constructor(public queryParams: DriveApiIndexParams = {}) {}
}

export class ReloadPageEntries implements LoadEntriesAction {
    static readonly type = '[Drive] Reload Page Entries';
    constructor(public queryParams: DriveApiIndexParams = {}, public page?: DrivePage) {}
}

export class CopySelectedEntries {
    static readonly type = '[Drive] Copy Selected Entries';
}

export class OpenUploadWindow {
    static readonly type = '[Drive] Open Upload Window';
    constructor(public type: 'file'|'directory') {}
}

export class ShowLoadingToast {
    static readonly type = '[Drive] Show Loading Toast';
    constructor(public message: string) {}
}

export class HideLoadingToast {
    static readonly type = '[Drive] Hide Loading Toast';
}

export class ResetState {
    static readonly type = '[Drive] Reset State';
}

export class UpdateEntries {
    static readonly type = '[Drive] Update Entries';
    constructor(public entries: DriveEntry[]) {}
}

export class SetCurrentUser {
    static readonly type = '[Drive] Set Current User';
    constructor(public user: User) {}
}

export class SetWorkspace {
    static readonly type = '[Drive] Set Workspace';
    constructor(public workspace: Workspace) {}
}

export class UpdateEntryDescription {
    static readonly type = '[Drive] Update Entry Description';
    constructor(public entry: FileEntry, public description: string) {}
}





