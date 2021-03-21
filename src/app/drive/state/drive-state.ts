import { DriveFolder } from '../folders/models/driveFolder';
import { DriveEntry } from '../files/models/drive-entry';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { FoldersApiService } from '../folders/api/folders-api.service';
import { finalize, tap } from 'rxjs/operators';
import { DriveApiIndexParams, DriveEntryApiService } from '../drive-entry-api.service';
import { Router } from '@angular/router';
import { DriveUrlsService } from '../drive-urls.service';
import { RouterState } from '@ngxs/router-plugin';
import isEqual from 'lodash/isEqual';
import {
    AddEntries,
    AddStar,
    BuildFolderTree,
    CopySelectedEntries,
    DeleteSelectedEntries,
    DeleteTrashedEntriesForever,
    DeselectAllEntries,
    EmptyTrash,
    HideLoadingToast,
    LoadMoreEntries,
    LoadUserFolders,
    LoadUserSpaceUsage,
    MoveEntries,
    OpenConfirmDialog,
    OpenFilePreview,
    OpenFolder,
    OpenSearchPage,
    OpenUploadsPanel,
    OpenUploadWindow,
    ReloadPageEntries,
    RemoveEntries,
    RemoveStar,
    ResetState,
    RestoreTrashedEntries,
    SelectAllEntries,
    SelectEntries,
    SetCurrentUser,
    SetViewMode,
    SetWorkspace,
    ShowLoadingToast,
    ToggleDetailsSidebar,
    ToggleSidebar,
    UpdateEntries,
    UpdateEntryDescription,
    UploadFiles,
} from './actions/commands';
import {
    BreakpointChanged,
    EntriesSelectedViaDrag,
    EntryContextMenuOpened,
    EntryDoubleTapped,
    EntryRenamed,
    EntrySelectedViaContextMenu,
    EntryTapped,
    FileDeleteSuccess,
    FolderPageOpened,
    LoadEntriesAction,
    MoveEntriesFailed,
    MoveEntriesSuccess,
    NewFolderCreated,
    NotEnoughSpaceError,
    RecentEntriesPageOpened,
    SearchPageOpened,
    SharesFolderOpened,
    StarredPageOpened,
    StartedDragging,
    StoppedDragging,
    TrashedEntriesDeleteSuccess,
    TrashedEntriesRestoreSuccess,
    TrashPageOpened,
    UserSpaceUsageChanged,
    WorkspacesIndexPageOpened,
} from './actions/events';
import { DriveStateModel, VIEW_MODE_KEY } from './models/drive-state-model';
import { DRIVE_STATE_MODEL_DEFAULTS } from './models/drive-state-model-defaults';
import { LocalStorage } from '@common/core/services/local-storage.service';
import { UploadQueueService } from '@common/uploads/upload-queue/upload-queue.service';
import { DriveUploadValidator } from '../uploads/drive-upload-validator';
import { openUploadWindow } from '@common/uploads/utils/open-upload-window';
import { Inject, Injectable } from '@angular/core';
import { UploadInputConfig } from '@common/uploads/upload-input-config';
import { UploadedFile } from '@common/uploads/uploaded-file';
import { UserSpaceUsage } from './models/user-space-usage';
import { LoadingToastMessages } from '../messages/loading-toast/loading-toast-messages';
import { User } from '@common/core/types/models/User';
import { DRIVE_PAGE_NAMES, DrivePage, TRASH_PAGE } from './models/drive-page';
import { DRIVE_UPLOAD_INPUT_CONFIG } from '../upload-input-config';
import { Tag } from '@common/core/types/models/Tag';
import { FileEntry } from '@common/uploads/types/file-entry';
import { hasKey } from '@common/core/utils/has-key';
import { BackendErrorResponse } from '../../../common/core/types/backend-error-response';
import { buildFolderTree } from '../sidebar/folders-tree/build-folder-tree';
import { WorkspacesService } from '../../../common/workspaces/workspaces.service';
import { Workspace } from '../../../common/workspaces/types/workspace';
import { Toast } from '../../../common/core/ui/toast.service';

@State<DriveStateModel>({
    name: 'drive',
    defaults: DRIVE_STATE_MODEL_DEFAULTS,
})
@Injectable()
export class DriveState {
    constructor(
        private foldersApi: FoldersApiService,
        private entriesApi: DriveEntryApiService,
        private router: Router,
        private driveUrls: DriveUrlsService,
        private uploads: UploadQueueService,
        private store: Store,
        private localStore: LocalStorage,
        private validator: DriveUploadValidator,
        private workspaces: WorkspacesService,
        private toast: Toast,
        @Inject(DRIVE_UPLOAD_INPUT_CONFIG) private uploadInputConfig: UploadInputConfig,
    ) {}

    @Selector()
    static flatFolders(state: DriveStateModel) {
        return state.flatFolders;
    }

    @Selector()
    static userFoldersLoaded(state: DriveStateModel) {
        return state.userFoldersLoaded;
    }

    @Selector()
    static activePage(state: DriveStateModel) {
        return state.activePage;
    }

    @Selector()
    static activePageName(state: DriveStateModel) {
        return state.activePage.name;
    }

    @Selector()
    static userFolders(state: DriveStateModel) {
        return state.folderTree;
    }

    @Selector()
    static selectedEntries(state: DriveStateModel) {
        return state.selectedEntries;
    }

    @Selector([DriveState.selectedEntries])
    static selectedEntryIds(state: DriveStateModel, selectedEntries: DriveEntry[]) {
        return selectedEntries.map(entry => entry.id);
    }

    @Selector([DriveState.selectedEntries])
    static selectedEntry(state: DriveStateModel, selected: DriveEntry[]) {
        return selected ? selected[selected.length - 1] : null;
    }

    @Selector([DriveState.selectedEntry])
    static selectedEntryOrActiveFolder(state: DriveStateModel, selected: DriveEntry[]) {
        return selected || state.activePage.folder;
    }

    @Selector([DriveState.selectedEntryOrActiveFolder, DriveState.flatFolders])
    static selectedEntryParent(state: DriveStateModel, selected: DriveFolder, folders: DriveFolder[]) {
        if ( ! selected || ! folders || ! selected.parent_id) {
            return state.rootFolder;
        }
        return folders.find(f => f.id === selected.parent_id);
    }

    @Selector([DriveState.selectedEntries])
    static anythingSelected(state: DriveStateModel, selectedEntries: DriveEntry[]) {
        return selectedEntries.length > 0;
    }

    @Selector([DriveState.selectedEntries])
    static allSelectedEntriesStarred(state: DriveStateModel, selectedEntries: DriveEntry[]) {
        return selectedEntries.every(entry => !!entry.tags.find(tag => tag.name === 'starred'));
    }

    @Selector([DriveState.selectedEntries])
    static onlyFoldersSelected(state: DriveStateModel, selectedEntries: DriveEntry[]) {
        return selectedEntries.every(entry => entry.type === 'folder');
    }

    @Selector()
    static entries(state: DriveStateModel) {
        return state.entries;
    }

    @Selector()
    static entriesEmpty(state: DriveStateModel) {
        // only return true if entries have already loaded
        return state.meta.currentPage && ! state.loading && state.entries.length === 0;
    }

    @Selector([DriveState.selectedEntries])
    static multipleEntriesSelected(state: DriveStateModel, selectedEntries: DriveEntry[]) {
        return selectedEntries.length > 1;
    }

    @Selector()
    static activeFolder(state: DriveStateModel) {
        return state.activePage.folder;
    }

    @Selector()
    static rootFolder(state: DriveStateModel) {
        return state.rootFolder;
    }

    @Selector()
    static meta(state: DriveStateModel) {
        return state.meta;
    }

    @Selector()
    static dragging(state: DriveStateModel) {
        return state.dragging;
    }

    @Selector()
    static loading(state: DriveStateModel) {
        return state.loading;
    }

    @Selector()
    static currentPage(state: DriveStateModel) {
        return state.meta.currentPage;
    }

    @Selector()
    static viewMode(state: DriveStateModel) {
        return state.viewMode;
    }

    @Selector()
    static detailsOpen(state: DriveStateModel) {
        return state.detailsVisible;
    }

    @Selector()
    static sidebarOpen(state: DriveStateModel) {
        return state.sidebarOpen;
    }

    @Selector()
    static sortColumn(state: DriveStateModel) {
        return state.meta.sortColumn;
    }

    @Selector()
    static sortDirection(state: DriveStateModel) {
        return state.meta.sortDirection;
    }

    @Selector()
    static canLoadMoreEntries(state: DriveStateModel) {
        return state.meta.currentPage < state.meta.lastPage;
    }

    @Selector()
    static userSpaceUsed(state: DriveStateModel) {
        return state.spaceUsage.used;
    }

    @Selector()
    static userSpaceAvailable(state: DriveStateModel) {
        return state.spaceUsage.available;
    }

    @Selector([DriveState.userSpaceUsed, DriveState.userSpaceAvailable])
    static spaceUsedPercent(state: DriveStateModel, spaceUsed: number, spaceAvail: number) {
        // null means that user has unlimited space available
        return spaceAvail === null ? 0 : ((spaceUsed * 100) / spaceAvail);
    }

    @Selector()
    static isMobile(state: DriveStateModel) {
        return state.isMobile;
    }

    static userHasPermission(permission: 'edit'|'owner', folder: DriveEntry, user: User) {
        // we are not in a folder view, can bail
        if ( ! folder || ! user) return false;

        // check if user is the owner of currently open folder
        const folderUser = (folder as DriveEntry).users.find(u => u.id === user.id);
        if (folderUser.owns_entry || folderUser.entry_permissions[permission]) {
            return true;
        }
    }

    @Selector()
    static currentUser(state: DriveStateModel) {
        return state.currentUser;
    }

    @Selector()
    static activeWorkspace(state: DriveStateModel) {
        return state.activeWorkspace;
    }

    @Selector([DriveState.activeFolder, DriveState.currentUser])
    static userOwnsActiveFolder(state: DriveStateModel, activeFolder: DriveEntry, currentUser: User) {
       return DriveState.userHasPermission('owner', activeFolder, currentUser);
    }

    @Selector([DriveState.selectedEntries, DriveState.currentUser])
    static userOwnsSelectedEntries(state: DriveStateModel, selectedEntries: DriveEntry[], currentUser: User) {
        return selectedEntries.every(entry => {
            return DriveState.userHasPermission('owner', entry, currentUser);
        });
    }

    @Selector([DriveState.selectedEntries, DriveState.currentUser])
    static userCanEditSelectedEntries(state: DriveStateModel, entries: DriveEntry[], currentUser: User) {
        return entries.every(entry => {
            const user = entry.users.find(u => u.id === currentUser.id);
            return user && (user.owns_entry || user.entry_permissions.edit);
        });
    }

    @Selector([DriveState.activePage, DriveState.currentUser, DriveState.activeWorkspace])
    static canUpload(state: DriveStateModel, page: DrivePage, currentUser: User, workspace: Workspace) {
        if (!page.folder || !currentUser || !workspace) {
            return false;
        }

        // check if user can create files in this workspace
        if (workspace?.id && page.folder.workspace_id === workspace.id) {
            const member = workspace.currentUser;
            return member && (member.is_owner || member.permissions.findIndex(p => p.name === 'files.create') > -1);

        // check if user has "edit" permission for folder if it's not part of workspace
        } else {
            return DriveState.userHasPermission('edit', page.folder, currentUser);
        }
    }

    @Action(LoadUserFolders)
    loadUserFolders(ctx: StateContext<DriveStateModel>) {
        return this.foldersApi.getAllForCurrentUser().pipe(tap(response => {
            ctx.patchState({rootFolder: response.rootFolder});
            return ctx.dispatch(new BuildFolderTree(response.folders));
        }));
    }

    @Action(BuildFolderTree)
    buildFolderTree(ctx: StateContext<DriveStateModel>, action: BuildFolderTree) {
        const flatFolders = action.folders || ctx.getState().flatFolders;
        const tree = buildFolderTree(flatFolders);
        ctx.patchState({
            folderTree: tree,
            flatFolders,
            userFoldersLoaded: true,
        });
    }

    @Action(WorkspacesIndexPageOpened)
    workspacesIndexPageOpened(ctx: StateContext<DriveStateModel>, action: WorkspacesIndexPageOpened) {
        ctx.patchState({activePage: action.page});
    }

    @Action(FolderPageOpened)
    @Action(RecentEntriesPageOpened)
    @Action(TrashPageOpened)
    @Action(StarredPageOpened)
    @Action(SearchPageOpened)
    @Action(SharesFolderOpened)
    @Action(ReloadPageEntries)
    @Action(LoadMoreEntries)
    loadDriveEntries(ctx: StateContext<DriveStateModel>, action: LoadEntriesAction) {
        const oldState = ctx.getState();
        const newState = {loading: true, meta: {...oldState.meta}} as Partial<DriveStateModel>;

        // only replace active page if it's actually specified, this way
        // "Reload" and "LoadMore" actions will not remove active page
        newState.activePage = action.page ? action.page : oldState.activePage;

        // set sorting from specified query params or specified page or currently active page
        newState.meta.sortColumn = action.queryParams.orderBy || oldState.meta.sortColumn || newState.activePage.sortColumn;
        newState.meta.sortDirection = action.queryParams.orderDir || oldState.meta.sortDirection || newState.activePage.sortDirection;

        // if it's not search page, clear type and query
        if (newState.activePage.name !== 'search') {
            newState.meta.query = null;
            newState.meta.type = null;
        }

        newState.meta.query = action.queryParams.query || newState.meta.query;
        newState.meta.type = action.queryParams.type || newState.meta.type;

        ctx.patchState(newState);
        const params = this.transformQueryParams({
            ...action.queryParams,
            ...newState.activePage.queryParams,
        });

        return this.entriesApi.getEntriesForFolder(params).pipe(tap(response => {
            const entries = action.loadMore ? oldState.entries : [];

            const state = {
                entries: entries.concat(response.data),
                meta: {
                    ...newState.meta,
                    lastPage: response.last_page,
                    currentPage: response.current_page
                },
                loading: false
            } as Partial<DriveStateModel>;

            state.activePage = {
                ...newState.activePage,
                folder: response.folder,
            };

            return ctx.patchState(state);
        }, () => {
            return ctx.patchState({loading: false});
        }));
    }

    @Action(OpenFolder, {cancelUncompleted: true})
    openFolder(ctx: StateContext<DriveStateModel>, action: OpenFolder) {
        const currentFolder = ctx.getState().activePage.folder;
        if (currentFolder && action.folder.id === currentFolder.id) return;

        if (action.folder && action.folder.deleted_at) {
            return ctx.dispatch(new OpenConfirmDialog({
                title: 'Folder is in trash',
                body: 'To view this folder, you need to restore it first.',
                ok: 'Restore'
            }, new RestoreTrashedEntries([action.folder as DriveFolder])));
        } else {
            ctx.patchState({loading: true});
            return this.router.navigate([this.driveUrls.folder(action.folder)]);
        }
    }

    @Action(OpenSearchPage, {cancelUncompleted: true})
    openSearchPage(ctx: StateContext<DriveStateModel>, action: OpenSearchPage) {
        const oldParams = this.store.selectSnapshot(RouterState.state).root.queryParams;
        if (isEqual(oldParams, action.queryParams)) return;
        ctx.patchState({loading: true});
        return this.router.navigate(['/drive/search'], {queryParams: action.queryParams});
    }

    @Action(EntriesSelectedViaDrag)
    @Action(EntrySelectedViaContextMenu)
    @Action(SelectEntries)
    selectEntries(ctx: StateContext<DriveStateModel>, action: EntriesSelectedViaDrag | EntrySelectedViaContextMenu | SelectEntries) {
        ctx.patchState({selectedEntries: action.entries});
    }

    @Action(DeselectAllEntries)
    deselectAllEntries(ctx: StateContext<DriveStateModel>) {
        if ( ! ctx.getState().selectedEntries.length) return;
        ctx.patchState({selectedEntries: []});
    }

    @Action(SelectAllEntries)
    SelectAllEntries(ctx: StateContext<DriveStateModel>) {
        ctx.patchState({selectedEntries: ctx.getState().entries.slice()});
    }

    @Action(EntryTapped)
    entryTapped(ctx: StateContext<DriveStateModel>, action: EntryTapped) {
        const current = ctx.getState().selectedEntries.slice();
        let alreadySelected = false;

        // remove entry with matching ID (if exists) to avoid duplicates
        const i = current.findIndex(curr => curr.id === action.entry.id);
        if (i > -1) {
            current.splice(i, 1);
            alreadySelected = true;
        }

        if (action.ctrlKey) {
            if (alreadySelected) {
                ctx.patchState({selectedEntries: current});
            } else {
                ctx.patchState({selectedEntries: [...current, action.entry]});
            }
        } else {
            ctx.patchState({selectedEntries: [action.entry]});
        }

        if (ctx.getState().isMobile) {
            this.entryDoubleTapped(ctx, action);
        }
    }

    @Action(EntryDoubleTapped)
    entryDoubleTapped(ctx: StateContext<DriveStateModel>, action: EntryDoubleTapped) {
        if (action.entry.type === 'folder') {
            return ctx.dispatch(new OpenFolder(action.entry as DriveFolder));
        } else {
            return ctx.dispatch(new OpenFilePreview([action.entry]));
        }
    }

    @Action(DeleteSelectedEntries)
    deleteSelectedEntries(ctx: StateContext<DriveStateModel>) {
        const entries = this.store.selectSnapshot(DriveState.selectedEntries),
            entryIds = this.store.selectSnapshot(DriveState.selectedEntryIds),
            flatFolders = this.store.selectSnapshot(DriveState.flatFolders),
            activePage = ctx.getState().activePage;

        return this.entriesApi.delete({entryIds}).pipe(tap(() => {
            // filter out deleted entries
            const newEntries = ctx.getState().entries
                .filter(entry => entryIds.indexOf(entry.id) === -1);

            const newState = {entries: newEntries} as Partial<DriveStateModel>,
                actions = [new FileDeleteSuccess(entries)] as any[];

            // clear selected entries
            newState.selectedEntries = [];

            // if selected folder was active, navigate to its parent
            if (activePage.folder && entryIds.indexOf(activePage.folder.id) > -1) {
                this.store.dispatch(new OpenFolder(this.store.selectSnapshot(DriveState.selectedEntryParent)));
            }

            // rebuild folders tree
            const folders = entries.filter(entry => entry.type === 'folder');
            if (folders.length) {
                folders.forEach(folder => delete flatFolders[folder.id]);
                newState.flatFolders = flatFolders;
                actions.push(new BuildFolderTree());
            }

            ctx.patchState(newState);
            return ctx.dispatch(actions);
        }));
    }

    @Action(EntryContextMenuOpened)
    fileContextMenuOpened(ctx: StateContext<DriveStateModel>, action: EntryContextMenuOpened) {
        if ( ! action?.entry?.id) return;

        const fileAlreadySelected = ctx.getState().selectedEntries
            .find(entry => entry.id === action.entry.id);

        if ( ! fileAlreadySelected) {
            return ctx.dispatch(new EntrySelectedViaContextMenu([action.entry]));
        }
    }

    @Action(NewFolderCreated)
    newFolderCreated(ctx: StateContext<DriveStateModel>, action: NewFolderCreated) {
        const state = ctx.getState();
        const parentFolderId = action.folder.parent_id;

        // start new folder into user folders cache
        const newState: Partial<DriveStateModel> = {
            flatFolders: [...state.flatFolders, action.folder]
        };

        // push new folder into parent folder entries, if parent is currently open
        if (parentFolderId === state.activePage.folder.id) {
            newState.entries = [action.folder, ...state.entries];
        }

        ctx.patchState(newState);

        // rebuild folder tree
        return ctx.dispatch(new BuildFolderTree());
    }

    @Action(EntryRenamed)
    entryRenamed(ctx: StateContext<DriveStateModel>, action: EntryRenamed) {
        const state = ctx.getState(),
            newState = {entries: state.entries.slice()} as Partial<DriveStateModel>,
            i = newState.entries.findIndex(curr => curr.id === action.entry.id);

        // rename entry inside main entries array
        if (i > -1) {
            newState.entries[i] = {...newState.entries[i], name: action.newName};
        }

        // rename entry inside selected entries array
        newState.selectedEntries = [{...state.selectedEntries[0], name: action.newName}];

        // rename active folder
        if (state.activePage.folder && state.activePage.folder.id === action.entry.id) {
            newState.activePage = {...state.activePage, folder: action.entry};
        }

        // rebuild folder tree
        if (action.entry.type === 'folder') {
            const flatFolders = {...state.flatFolders};
            flatFolders[action.entry.id] = {...flatFolders[action.entry.id], name: action.newName};
            newState.flatFolders = flatFolders;
            ctx.dispatch(new BuildFolderTree());
        }

        ctx.patchState(newState);
    }

    @Action(StartedDragging)
    startedDragging(ctx: StateContext<DriveStateModel>) {
        ctx.patchState({dragging: true});
    }

    @Action(StoppedDragging)
    stoppedDragging(ctx: StateContext<DriveStateModel>) {
        ctx.patchState({dragging: false});
    }

    @Action(MoveEntries)
    movieEntries(ctx: StateContext<DriveStateModel>, action: MoveEntries) {
        const entries = action.entries || ctx.getState().selectedEntries;

        if ( ! DriveState.canMoveEntriesTo(entries, action.destination)) return;

        ctx.dispatch(new ShowLoadingToast(LoadingToastMessages.moveEntries));

        const oldLocation = entries[0].parent_id;

        return this.entriesApi.moveEntries({entryIds: entries.map(entry => entry.id), destination: action.destination?.id}).pipe(
            finalize(() => ctx.dispatch(new HideLoadingToast())),
            tap(response => {
                return ctx.dispatch(new MoveEntriesSuccess(action.destination?.id, oldLocation, response.entries));
            }, (errResponse: BackendErrorResponse) => {
                return ctx.dispatch(new MoveEntriesFailed(errResponse.errors));
            })
        );
    }

    @Action(MoveEntriesSuccess)
    moveEntriesSuccess(ctx: StateContext<DriveStateModel>, action: MoveEntriesSuccess) {
        const state = ctx.getState(),
            entryIds = action.entries.map(entry => entry.id),
            folders = action.entries.filter(entry => entry.type === 'folder');

        // remove moved entries from old folder
        const newState = {
            selectedEntries: [],
            entries: state.entries.filter(entry => entryIds.indexOf(entry.id) === -1)
        } as Partial<DriveStateModel>;

        // rebuild folder tree
        if (folders.length) {
            newState.flatFolders = {...state.flatFolders};
            action.entries
                .filter(entry => entry.type === 'folder')
                .forEach(entry => newState.flatFolders[entry.id] = entry as DriveFolder);
        }

        // update active folder
        if (state.activePage.folder) {
            const folder = action.entries.find(entry => state.activePage.folder.id === entry.id);
            if (folder) newState.activePage = {...state.activePage, folder};
        }

        ctx.patchState(newState);
        return ctx.dispatch(new BuildFolderTree());
    }

    @Action(SetViewMode)
    setViewMode(ctx: StateContext<DriveStateModel>, action: SetViewMode) {
        this.localStore.set(VIEW_MODE_KEY, action.mode);
        ctx.patchState({viewMode: action.mode});
    }

    @Action(ToggleDetailsSidebar)
    toggleDetailsSidebar(ctx: StateContext<DriveStateModel>) {
        ctx.patchState({
            detailsVisible: !ctx.getState().detailsVisible
        });
    }

    @Action(ToggleSidebar)
    toggleSidebar(ctx: StateContext<DriveStateModel>) {
        ctx.patchState({
            sidebarOpen: !ctx.getState().sidebarOpen
        });
    }

    @Action(AddEntries)
    addEntries(ctx: StateContext<DriveStateModel>, action: AddEntries) {
        const currentEntries = ctx.getState().entries,
            spaceUsage = ctx.getState().spaceUsage;

        const newEntries = action.entries
            .filter(entry => !currentEntries.find(curr => curr.id === entry.id));

        const newSize = newEntries.filter(entry => entry.type !== 'folder')
            .reduce((sum, entry) => sum + entry.file_size, 0);

        ctx.patchState({
            entries: [...newEntries, ...currentEntries],
            spaceUsage: {...spaceUsage, used: spaceUsage.used + newSize}
        });
    }

    @Action(UploadFiles)
    uploadFiles(ctx: StateContext<DriveStateModel>, action: UploadFiles) {
        if ( ! this.enoughSpaceLeftToUpload(ctx.getState().spaceUsage, action.files)) {
            return ctx.dispatch(new NotEnoughSpaceError());
        }

        if ( ! action.files.length) return;

        ctx.dispatch(new OpenUploadsPanel());

        const state = ctx.getState(),
            folder = state.activePage.folder,
            parentId = folder.id || null;

        const config = {
            httpParams: {parentId},
            validator: this.validator,
        };

        return this.uploads.start(action.files, config).pipe(
            tap(response => {
                // get parent folders, if user has uploaded folders and not single files
                const entries = [response.fileEntry.parent, response.fileEntry];

                // remove all entries that are not direct child of currently open folder
                const newEntries = entries
                    .filter(newEntry => newEntry && newEntry.parent_id === parentId);

                // add newly uploaded files and created folders
                ctx.dispatch(new AddEntries(newEntries as DriveEntry[]));

                // rebuild folder tree, if there are any folders
                const folders = entries.filter(entry => entry && entry.type === 'folder');
                if (folders.length) {
                    const flatFolders = [...ctx.getState().flatFolders, ...folders] as DriveFolder[];
                    ctx.patchState({flatFolders});
                    ctx.dispatch(new BuildFolderTree());
                }
            })
        );
    }

    @Action(DeleteTrashedEntriesForever)
    deleteTrashedEntriesForever(ctx: StateContext<DriveStateModel>) {
        const selectedEntries = this.store.selectSnapshot(DriveState.selectedEntries),
            entryIds = selectedEntries.map(entry => entry.id);

        const newEntries = ctx.getState().entries
                .filter(entry => entryIds.indexOf(entry.id) === -1);

        return this.entriesApi.delete({entryIds, deleteForever: true}).pipe(tap(() => {
            ctx.patchState({
                entries: newEntries,
                selectedEntries: [],
            });

            return ctx.dispatch([
                new TrashedEntriesDeleteSuccess(selectedEntries),
                new UserSpaceUsageChanged(),
            ]);
        }));
    }

    @Action(RestoreTrashedEntries)
    restoreTrashedEntries(ctx: StateContext<DriveStateModel>, action: RestoreTrashedEntries) {
        const activePage = this.store.selectSnapshot(DriveState.activePage);
        const restoredEntries = action.entries || this.store.selectSnapshot(DriveState.selectedEntries);
        const entryIds = restoredEntries.map(entry => entry.id);
        let newEntries: DriveEntry[];

        if (activePage.name === TRASH_PAGE.name) {
            newEntries = ctx.getState().entries
                .filter(entry => entryIds.indexOf(entry.id) === -1);
        } else {
            newEntries = [...ctx.getState().entries, ...action.entries];
        }

        return this.entriesApi.restore({entryIds}).pipe(tap(() => {
            ctx.patchState({
                entries: newEntries,
                selectedEntries: [],
            });

            return ctx.dispatch(new TrashedEntriesRestoreSuccess(restoredEntries));
        }));
    }

    @Action(EmptyTrash, {cancelUncompleted: true})
    emptyTrash(ctx: StateContext<DriveStateModel>) {
        ctx.dispatch(new ShowLoadingToast(LoadingToastMessages.emptyTrash));

        return this.entriesApi.emptyTrash().pipe(
            finalize(() => ctx.dispatch(new HideLoadingToast())),
            tap(() => {
                ctx.patchState({
                    entries: [],
                    selectedEntries: [],
                });

                return ctx.dispatch(new UserSpaceUsageChanged());
            })
        );
    }

    @Action(AddStar, {cancelUncompleted: true})
    addStar(ctx: StateContext<DriveStateModel>, action: AddStar) {
        const state = ctx.getState(),
            ids = action.entries.map(entry => entry.id);

        return this.entriesApi.addStar(ids).pipe(tap(response => {
            const newEntries = state.entries.map(entry => {
                if (ids.indexOf(entry.id) > -1) {
                    if ( ! entry.tags) entry.tags = [];
                    entry.tags.push(response.tag);
                }
                return entry;
            });

            const selectedEntries = state.selectedEntries.map(entry => {
                entry.tags.push(response.tag);
                return entry;
            });

            ctx.patchState({
                entries: newEntries,
                selectedEntries: selectedEntries,
            });
        }));
    }

    @Action(RemoveStar, {cancelUncompleted: true})
    removeStar(ctx: StateContext<DriveStateModel>, action: RemoveStar) {
        const state = ctx.getState(),
            ids = action.entries.map(entry => entry.id);

        return this.entriesApi.removeStar(ids).pipe(tap(response => {
            const newEntries = state.entries.map(entry => {
                if (ids.indexOf(entry.id) > -1) this.removeTag(entry, response.tag);
                return entry;
            });

            const selectedEntries = state.selectedEntries
                .map(entry => this.removeTag(entry, response.tag));

            ctx.patchState({
                entries: newEntries,
                selectedEntries: selectedEntries
            });
        }));
    }

    @Action(RemoveEntries)
    removeEntries(ctx: StateContext<DriveStateModel>, action: RemoveEntries) {
        const ids = action.entries.map(entry => entry.id);
        const newEntries = ctx.getState().entries
            .filter(entry => ids.indexOf(entry.id) === -1);
        ctx.patchState({
            entries: newEntries
        });
        this.toast.open({message: 'Removed :count items.', replacements: {count: ids.length}});
    }

    @Action(CopySelectedEntries)
    copySelectedEntries(ctx: StateContext<DriveStateModel>) {
        const entries = this.store.selectSnapshot(DriveState.selectedEntries),
            entryIds = entries.map(entry => entry.id),
            folders = entries.filter(entry => entry.type === 'folder'),
            oldState = ctx.getState();

        if ( ! this.enoughSpaceLeftToUpload(ctx.getState().spaceUsage, entries)) {
            return ctx.dispatch(new NotEnoughSpaceError());
        }

        ctx.dispatch(new ShowLoadingToast(LoadingToastMessages.copyEntries));

        return this.entriesApi.copy({entryIds}).pipe(
            finalize(() => ctx.dispatch(new HideLoadingToast())),
            tap(response => {
                const newState = {} as Partial<DriveStateModel>;

                // show copied entries, if we are in a folder view
                if (ctx.getState().activePage.folder) {
                    newState.entries = oldState.entries.concat(response.entries);
                }

                // rebuild folder tree
                if (folders.length) {
                    newState.flatFolders = {...oldState.flatFolders};
                    response.entries
                        .filter(folder => folder.type === 'folder')
                        .forEach(folder => newState.flatFolders.push(folder as DriveFolder));
                }

                ctx.patchState(newState);

                // update user space usage
                ctx.dispatch(new UserSpaceUsageChanged());

                // rebuild folder tree
                if (folders.length) ctx.dispatch(new BuildFolderTree());

                const activePage = this.store.selectSnapshot(DriveState.activePage);
                const location = activePage.name === DRIVE_PAGE_NAMES.SHARES ? `${this.workspaces.activeWorkspace$.value.name} workspace` : activePage.folder.name;
                this.toast.open({message: `Copied :count file(s) into :location.`, replacements: {count: entryIds.length, location}});
            })
        );
    }

    @Action(OpenUploadWindow)
    openUploadWindow(ctx: StateContext<DriveStateModel>, action: OpenUploadWindow) {
        const config = {
            ...this.uploadInputConfig,
            directory: action.type === 'directory'
        };

        openUploadWindow(config).then(files => {
            if ( ! files || ! files.length) return;
            ctx.dispatch(new UploadFiles(files));
        });
    }

    @Action(LoadUserSpaceUsage)
    @Action(UserSpaceUsageChanged)
    loadUserSpaceUsage(ctx: StateContext<DriveStateModel>) {
        return this.entriesApi.getSpaceUsage().pipe(tap(spaceUsage => {
            ctx.patchState({spaceUsage: {used: spaceUsage.used, available: spaceUsage.available}});
        }));
    }

    @Action(UpdateEntries)
    updateEntries(ctx: StateContext<DriveStateModel>, action: UpdateEntries) {
        const mainEntries = ctx.getState().entries.slice(),
            selectedEntries = ctx.getState().selectedEntries.slice();

        action.entries.forEach(updatedEntry => {
            // update main entries
            const mainIndex = mainEntries.findIndex(entry => updatedEntry.id === entry.id);
            mainEntries[mainIndex] = {...mainEntries[mainIndex], ...updatedEntry};

            // update selected entries
            const selectedIndex = selectedEntries.findIndex(entry => updatedEntry.id === entry.id);
            if (selectedIndex > -1) {
                selectedEntries[selectedIndex] = {...selectedEntries[selectedIndex], ...updatedEntry};
            }
        });

        ctx.patchState({entries: mainEntries, selectedEntries});
    }

    @Action(UpdateEntryDescription)
    updateEntryDescription(ctx: StateContext<DriveStateModel>, {entry, description}: UpdateEntryDescription) {
        return this.entriesApi.update(entry.id, {description})
            .pipe(tap(response => {
                ctx.dispatch(new UpdateEntries([response.fileEntry]));
            }));
    }

    @Action(BreakpointChanged)
    breakpointChanged(ctx: StateContext<DriveStateModel>, action: BreakpointChanged) {
        ctx.patchState({
            isMobile: action.status.isMobile,
            sidebarOpen: !action.status.isMobile,
            detailsVisible: !action.status.isMobile,
        });
    }

    @Action(SetCurrentUser)
    setCurrentUser(ctx: StateContext<DriveStateModel>, action: SetCurrentUser) {
        ctx.patchState({currentUser: action.user});
    }

    @Action(SetWorkspace)
    setWorkspace(ctx: StateContext<DriveStateModel>, action: SetWorkspace) {
        ctx.patchState({activeWorkspace: action.workspace});
    }

    @Action(ResetState)
    resetState(ctx: StateContext<DriveStateModel>) {
        ctx.setState({...DRIVE_STATE_MODEL_DEFAULTS, viewMode: ctx.getState().viewMode});
    }

    private transformQueryParams(params: DriveApiIndexParams): DriveApiIndexParams {
        const page = this.store.selectSnapshot(DriveState.activePage),
            meta = this.store.selectSnapshot(DriveState.meta);

        const queryParams = {
            orderBy: meta.sortColumn,
            orderDir: meta.sortDirection,
            ...params
        };

        if (page.name === DRIVE_PAGE_NAMES.FOLDER) {
            queryParams.folderId = page.folderHash;
        }
        if (meta.query) queryParams.query = meta.query;
        if (meta.type) queryParams.type = meta.type;

        return queryParams;
    }

    /**
     * Check if user has enough space left to upload all specified files.
     */
    private enoughSpaceLeftToUpload(spaceUsage: UserSpaceUsage, files: (UploadedFile|FileEntry)[]) {
        const newSize = files.reduce((sum, file) => {
            const size = hasKey('size', file) ? file.size : file.file_size;
            return sum + size;
        }, 0);
        const currentlyUsing = spaceUsage.used;
        const availableSpace = spaceUsage.available;
        return (newSize + currentlyUsing) < availableSpace;
    }

    private removeTag(entry: DriveEntry, tag: Tag) {
        entry.tags = entry.tags.filter(t => t.id !== tag.id);
        return entry;
    }

    static canMoveEntriesTo(movingEntries: DriveEntry[], destination?: DriveFolder) {
        if (destination && destination.type !== 'folder') return false;

        // should not be able to move folder into it's
        // own child or same folder it's already in
        return movingEntries.every(entry => {
            // entry is already in this folder
            if (destination?.id === entry.parent_id) return false;

            // trying to move folder into it's own child
            if (destination && destination.path.startsWith(entry.path)) return false;

            return true;
        });
    }
}
