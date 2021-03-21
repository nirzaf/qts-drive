import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {NotificationService} from '@common/notifications/notification-list/notification.service';
import {OverlayPanelRef} from '@common/core/ui/overlay-panel/overlay-panel-ref';
import { matDialogAnimations } from '@angular/material/dialog';
import {Settings} from '@common/core/config/settings.service';
import {CurrentUser} from '@common/auth/current-user';

@Component({
    selector: 'notification-panel',
    templateUrl: './notification-panel.component.html',
    styleUrls: ['./notification-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'class': 'material-panel',
        '[@dialogContainer]': `'enter'`
    },
    animations: [
        matDialogAnimations.dialogContainer,
    ]
})
export class NotificationPanelComponent implements OnInit {
    constructor(
        public notifications: NotificationService,
        public settings: Settings,
        private overlayPanelRef: OverlayPanelRef<NotificationPanelComponent>,
        public currentUser: CurrentUser,
    ) {}

    ngOnInit() {
        if ( ! this.notifications.all$.value) {
            this.notifications.load().subscribe();
        }
    }

    public closePanel() {
        this.overlayPanelRef.close();
    }

    public markAllAsRead() {
        this.closePanel();
        this.notifications.markAllAsRead().subscribe();
    }
}
