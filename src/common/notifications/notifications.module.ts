import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationSubscriptionsComponent } from './notification-subscriptions/notification-subscriptions.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ImageOrIconModule } from '@common/core/ui/image-or-icon/image-or-icon.module';
import { NotificationListModule } from '@common/notifications/notification-list/notification-list.module';
import { MaterialNavbarModule } from '@common/core/ui/material-navbar/material-navbar.module';
import { NotificationPageComponent } from './notification-page/notification-page.component';
import {PaginationWidgetModule} from '@common/shared/pagination-widget/pagination-widget.module';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
    declarations: [
        NotificationSubscriptionsComponent,
        NotificationPageComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NotificationsRoutingModule,
        MaterialNavbarModule,
        ImageOrIconModule,
        NotificationListModule,
        PaginationWidgetModule,

        // material
        MatCheckboxModule,
        MatButtonModule,
    ]
})
export class NotificationsModule {
}
