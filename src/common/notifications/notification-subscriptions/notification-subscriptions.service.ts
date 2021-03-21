import {Injectable} from '@angular/core';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {BackendResponse} from '@common/core/types/backend-response';
import {
    NotificationSubscriptionGroup,
    NotificationSubscriptionsResponse
} from '@common/notifications/notification-subscriptions/notification-subscription';

export type UpdateNotificationSubscriptionsPayload = {
    notif_id: string;
    channels: {[key: string]: boolean};
}[];

@Injectable({
    providedIn: 'root'
})
export class NotificationSubscriptionsService {
    constructor(private http: AppHttpClient) {}

    public getAll(userId: number): BackendResponse<NotificationSubscriptionsResponse> {
        return this.http.get(`notifications/${userId}/subscriptions`);
    }

    public updateUserSubscriptions(userId: number, selections: UpdateNotificationSubscriptionsPayload): BackendResponse<void> {
        return this.http.put(`notifications/${userId}/subscriptions`, {selections});
    }
}
