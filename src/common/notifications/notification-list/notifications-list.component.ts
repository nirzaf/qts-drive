import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    NgZone,
    Optional,
    Output
} from '@angular/core';
import {Router} from '@angular/router';
import {NotificationService} from '@common/notifications/notification-list/notification.service';
import {DatabaseNotification, DatabaseNotificationAction} from '@common/notifications/database-notification';
import {Settings} from '@common/core/config/settings.service';
import {OverlayPanelRef} from '@common/core/ui/overlay-panel/overlay-panel-ref';
import {NotificationPanelComponent} from '@common/notifications/notification-list/notification-panel/notification-panel.component';
import {isAbsoluteUrl} from '@common/core/utils/is-absolute-url';
import {CurrentUser} from '@common/auth/current-user';

@Component({
    selector: 'notification-list',
    templateUrl: './notification-list.component.html',
    styleUrls: ['./notification-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationListComponent {
    @Input() @HostBinding('class.compact') compact = false;
    @Input() notifications: DatabaseNotification[];
    @Output() markedAsRead = new EventEmitter<DatabaseNotification>();

    constructor(
        public settings: Settings,
        protected zone: NgZone,
        protected router: Router,
        public api: NotificationService,
        public currentUser: CurrentUser,
        @Optional() private overlayPanelRef: OverlayPanelRef<NotificationPanelComponent>,
    ) {}

    public haveNotifications() {
        return this.notifications && Object.keys(this.notifications).length;
    }

    public performAction(actionConfig: DatabaseNotificationAction, notification: DatabaseNotification, e: MouseEvent) {
        if (actionConfig) {
            e.stopPropagation();
            e.preventDefault();
            this.overlayPanelRef && this.overlayPanelRef.close();
            if ( ! notification.read_at) {
                this.api.markAsRead([notification.id]).subscribe(response => {
                    notification.read_at = response.date;
                    this.markedAsRead.emit(notification);
                });
            }

            this.emitAction(actionConfig, notification);
            if ( ! actionConfig.emitOnly) {
                if (isAbsoluteUrl(actionConfig.action)) {
                    window.open(actionConfig.action);
                } else {
                    this.router.navigate([actionConfig.action]);
                }
            }
        }
    }

    public closePanel() {
        this.overlayPanelRef && this.overlayPanelRef.close();
    }

    public emitAction(action: DatabaseNotificationAction, notification: DatabaseNotification) {
        this.api.clickedOnNotification$.next({notification, action});
        this.closePanel();
    }

    trackByFn = (i: number, notification: DatabaseNotification) => notification.id;
}
