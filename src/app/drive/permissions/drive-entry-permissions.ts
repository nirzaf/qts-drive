export interface DriveEntryPermissions {
    edit?: boolean;
    view?: boolean;
    download?: boolean;
}

export const DRIVE_ENTRY_FULL_PERMISSIONS = {
    edit: true,
    view: true,
    download: true,
};
