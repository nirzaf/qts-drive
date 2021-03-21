export interface DatabaseNotification {
    id: string;
    read_at: string;
    relative_created_at: string;
    time_period: string;
    type: string;
    data: DatabaseNotificationData;
}

export interface DatabaseNotificationAction {
    label: string;
    action: string;
    // only emit "notificationClicked" event on notification
    // server and don't open "action" link in new window
    emitOnly?: boolean;
    color?: 'accent'|'primary'|'warn'|'gray';
}

export interface DatabaseNotificationData {
    image: string;
    warning?: boolean;
    mainAction?: DatabaseNotificationAction;
    buttonActions?: DatabaseNotificationAction[];
    lines: {
        content: string;
        icon?: string;
        type?: 'secondary'|'primary';
        action?: DatabaseNotificationAction;
    }[];
}

export interface BroadcastNotification extends DatabaseNotificationData {
    id: string;
    type: string;
}
