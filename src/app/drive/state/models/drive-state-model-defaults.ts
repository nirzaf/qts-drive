import { DriveStateModel } from './drive-state-model';

export const DRIVE_STATE_MODEL_DEFAULTS: DriveStateModel = {
    isMobile: false,
    activePage: null,
    folderTree: [],
    flatFolders: [],
    userFoldersLoaded: false,
    entries: [],
    selectedEntries: [],
    dragging: false,
    loading: false,
    uploadsPanelOpen: false,
    viewMode: 'grid' as 'grid'|'list',
    detailsVisible: true,
    sidebarOpen: true,
    currentUser: null,
    activeWorkspace: null,
    spaceUsage: {
        available: null,
        used: null,
    },
    meta: {
        sortColumn: 'updated_at',
        sortDirection: 'desc',
        currentPage: 0,
        lastPage: 0,
    },
};
