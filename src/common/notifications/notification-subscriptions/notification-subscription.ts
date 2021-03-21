export interface NotificationSubscription {
    id?: number;
    name: string;
    notif_id: string;
    channels: {[key: string]: boolean};
}

export interface NotificationSubscriptionGroup {
    group_name: string;
    notifications: Pick<NotificationSubscription, 'name' | 'notif_id'>[];
}

export interface NotificationSubscriptionsResponse {
    available_channels: string[];
    grouped_notifications: NotificationSubscriptionGroup[];
    user_selections: NotificationSubscription[];
}
