import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Settings} from '@common/core/config/settings.service';
import {NotificationService} from '@common/notifications/notification-list/notification.service';
import {BreakpointsService} from '@common/core/ui/breakpoints.service';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import {DatabaseNotification} from '@common/notifications/database-notification';

@Component({
    selector: 'notification-page',
    templateUrl: './notification-page.component.html',
    styleUrls: ['./notification-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationPageComponent implements OnInit {
    public pagination$ = new BehaviorSubject<PaginationResponse<DatabaseNotification>>(null);

    constructor(
        public settings: Settings,
        public notifications: NotificationService,
        public breakpoints: BreakpointsService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.loadPage(this.route.snapshot.queryParams.page || 1);
    }

    public loadPage(page: number) {
        this.notifications.load({page, perPage: 25})
            .subscribe(response => {
                this.pagination$.next(response.pagination);
            });
    }

    public markAsRead(markedNotif: DatabaseNotification) {
        const notification = this.pagination$.value.data.find(n => n.id === markedNotif.id);
        notification.read_at = markedNotif.read_at;
    }
}
