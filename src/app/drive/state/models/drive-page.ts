import { DrivePageType } from './available-pages';
import { DriveFolder } from '../../folders/models/driveFolder';
import { SortColumn, SortDirection } from '../../entries/available-sorts';

export const DRIVE_PAGE_NAMES: {[key: string]: DrivePageType} = {
    FOLDER: 'folder',
    RECENT: 'recent',
    TRASH: 'trash',
    SHARES: 'shares',
    STARRED: 'starred',
    SEARCH: 'search',
    WORKSPACES: 'workspaces',
};

export interface DrivePageParams {
    name: DrivePageType;
    viewName: string;
    folder?: DriveFolder;
    folderHash?: string;
    hasActions?: boolean;
    disableSort?: boolean;
    sortColumn?: SortColumn;
    queryParams?: object;
    sortDirection?: SortDirection;
}

export class DrivePage implements DrivePageParams {
    name = null;
    viewName = null;
    folder = null;
    folderHash = null;
    hasActions = false;
    sortColumn = 'updated_at' as SortColumn;
    sortDirection = 'desc' as SortDirection;
    queryParams = {};

    constructor(params: DrivePageParams) {
        Object.keys(params).forEach(key => {
            this[key] = params[key];
        });
    }
}

export const RECENT_PAGE = new DrivePage({
    name: DRIVE_PAGE_NAMES.RECENT,
    viewName: 'Recent',
    disableSort: true,
    sortColumn: 'created_at',
    sortDirection: 'desc',
    queryParams: {
        recentOnly: true,
    }
});

export const SEARCH_PAGE = new DrivePage({
    name: DRIVE_PAGE_NAMES.SEARCH,
    viewName: 'Search results',
});

export const SHARES_PAGE = new DrivePage({
    name: DRIVE_PAGE_NAMES.SHARES,
    viewName: 'Shared',
    queryParams: {
        sharedOnly: true,
    }
});

export const TRASH_PAGE = new DrivePage({
    name: DRIVE_PAGE_NAMES.TRASH,
    viewName: 'Trash',
    hasActions: true,
    queryParams: {
        deletedOnly: true,
    }
});

export const WORKSPACE_INDEX_PAGE = new DrivePage({
    name: DRIVE_PAGE_NAMES.WORKSPACES,
    viewName: 'Workspaces',
});

export const STARRED_PAGE = new DrivePage({
    name: DRIVE_PAGE_NAMES.STARRED,
    viewName: 'Starred',
    queryParams: {
        starredOnly: true,
    }
});

export class FolderPage extends DrivePage {
    constructor(folder?: DriveFolder) {
        super({
            name: DRIVE_PAGE_NAMES.FOLDER,
            viewName: folder?.name,
            folder,
            folderHash: folder?.hash,
            hasActions: true
        });
    }
}
