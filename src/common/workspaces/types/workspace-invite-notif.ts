import { DatabaseNotification, DatabaseNotificationData } from '../../notifications/database-notification';

export const WORKSPACE_INVITE_NOTIF_TYPE = 'Common\\Workspaces\\Notifications\\WorkspaceInvitation';

export interface WorkspaceInviteNotif extends DatabaseNotification {
    data: DatabaseNotificationData & {inviteId: string};
}
