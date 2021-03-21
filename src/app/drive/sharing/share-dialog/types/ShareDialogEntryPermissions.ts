import { DriveEntryPermissions } from '../../../permissions/drive-entry-permissions';

export interface ShareDialogEntryPermissions extends DriveEntryPermissions {
    varies?: true;
}
