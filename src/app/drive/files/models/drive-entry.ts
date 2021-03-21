import { DriveEntryPermissions } from '../../permissions/drive-entry-permissions';
import { FileEntry } from '@common/uploads/types/file-entry';

export interface DriveEntry extends FileEntry {
    users: DriveEntryUser[];
    workspace_id: number;
    permissions: string[];
}

export interface DriveEntryUser {
    id: number;
    email: string;
    display_name: string;
    avatar: string;
    owns_entry: boolean;
    entry_permissions: DriveEntryPermissions;
}
