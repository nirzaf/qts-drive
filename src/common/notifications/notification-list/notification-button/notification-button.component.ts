import {ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BOTTOM_POSITION} from '@common/core/ui/overlay-panel/positions/bottom-position';
import {OverlayPanel} from '@common/core/ui/overlay-panel/overlay-panel.service';
import {NotificationPanelComponent} from '@common/notifications/notification-list/notification-panel/notification-panel.component';
import {NotificationService} from '@common/notifications/notification-list/notification.service';
import {BELL_ANIMATION} from '@common/notifications/notification-list/notification-button/bell-animation';
import {distinctUntilChanged, skip} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'notification-button',
    templateUrl: './notification-button.component.html',
    styleUrls: ['./notification-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        BELL_ANIMATION,
    ]
})
export class NotificationButtonComponent implements OnInit {
    @ViewChild('notifButton', {static: true, read: ElementRef}) notifButton: ElementRef<HTMLButtonElement>;
    public animationTrigger$ = new BehaviorSubject<boolean>(false);

    constructor(
        private overlay: OverlayPanel,
        public notifications: NotificationService,
    ) {}

    public ngOnInit(): void {
        this.notifications.unreadCount$
            .pipe(distinctUntilChanged(), skip(1))
            .subscribe(() => {
                this.animationTrigger$.next(true);
            });
    }

    public openNotificationPanel() {
        this.overlay.open(NotificationPanelComponent, {
            position: BOTTOM_POSITION,
            mobilePosition: 'center',
            origin: this.notifButton,
        });
    }

    public stopAnimation() {
        this.animationTrigger$.next(false);
    }
}
