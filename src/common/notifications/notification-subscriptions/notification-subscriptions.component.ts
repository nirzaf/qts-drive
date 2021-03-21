import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    NotificationSubscription, NotificationSubscriptionGroup, NotificationSubscriptionsResponse
} from '@common/notifications/notification-subscriptions/notification-subscription';
import {
    NotificationSubscriptionsService, UpdateNotificationSubscriptionsPayload
} from '@common/notifications/notification-subscriptions/notification-subscriptions.service';
import { CurrentUser } from '@common/auth/current-user';
import { Toast } from '@common/core/ui/toast.service';
import { BehaviorSubject } from 'rxjs';
import { filter, finalize } from 'rxjs/operators';
import { Settings } from '@common/core/config/settings.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'notification-subscriptions',
    templateUrl: './notification-subscriptions.component.html',
    styleUrls: ['./notification-subscriptions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationSubscriptionsComponent implements OnInit {
    public groupedNotifications: NotificationSubscriptionGroup[];
    public availableChannels: string[] = [];
    private initialUserSelections: NotificationSubscription[];
    public loading$ = new BehaviorSubject<boolean>(false);
    public supportsBrowserNotifications = ('Notification' in window);
    public form = new FormGroup({});

    constructor(
        private route: ActivatedRoute,
        private api: NotificationSubscriptionsService,
        private currentUser: CurrentUser,
        private toast: Toast,
        private cd: ChangeDetectorRef,
        public settings: Settings,
    ) {}

    ngOnInit() {
        this.route.data.subscribe((data: {api: NotificationSubscriptionsResponse}) => {
            this.groupedNotifications = data.api.grouped_notifications;
            this.availableChannels = data.api.available_channels;
            this.initialUserSelections = data.api.user_selections;
            this.groupedNotifications.forEach(group => {
                group.notifications.forEach(s => this.addNotifFormField(s.notif_id));
            });
        });
    }

    public addNotifFormField(notifId: string) {
        const channelGroup = new FormGroup({});
        this.availableChannels.forEach(channel => {
            const initial = this.initialUserSelections.find(s => s.notif_id === notifId)?.channels[channel];
            const disabled = channel === 'browser' && !this.supportsBrowserNotifications;
            const control = new FormControl({value: initial ?? false, disabled});
            if (channel === 'browser' && Notification.permission !== 'granted') {
                control.valueChanges.pipe(filter(isChecked => isChecked)).subscribe(_ => {
                    if (Notification.permission === 'denied') {
                        this.toast.open('Notifications blocked. Please enable them for this site from browser settings.');
                        control.setValue(false, {emitEvent: false});
                        this.cd.markForCheck();
                    } else {
                        Notification.requestPermission().then(permission => {
                            if (permission !== 'granted') {
                                control.setValue(false, {emitEvent: false});
                                this.cd.markForCheck();
                            }
                        });
                    }
                });
            }
            channelGroup.addControl(channel, control);
        });
        this.form.addControl(notifId, channelGroup);
    }

    public toggleAllRowsFor(channelName: string) {
        const newValue = !this.allRowsSelectedFor(channelName);
        Object.values(this.form.controls).forEach(c => {
            (c as FormGroup).controls[channelName].setValue(newValue);
            (c as FormGroup).controls[channelName].markAsDirty();
        });
    }

    public allRowsSelectedFor(channelName: string): boolean {
        return Object.values(this.form.controls).every(control => {
            return (control as FormGroup).controls[channelName].value === true;
        });
    }

    public someRowsSelectedFor(channelName: string): boolean {
        return Object.values(this.form.controls).some(control => {
            return (control as FormGroup).controls[channelName].value === true;
        });
    }

    public saveSettings() {
        this.loading$.next(true);
        const payload = this.getPayload();
        this.api.updateUserSubscriptions(this.currentUser.get('id'), payload)
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(() => {
                this.form.markAsPristine();
                this.toast.open('Notification settings updated.');
            });
    }

    private getPayload(): UpdateNotificationSubscriptionsPayload {
        return Object.entries(this.form.controls)
            .filter(([_, control]) => control.dirty)
            .map(([notifId, control]) => {
                return {notif_id: notifId, channels: control.value};
            });
    }
}
