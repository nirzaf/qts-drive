import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotificationListComponent} from '@common/notifications/notification-list/notifications-list.component';
import {ImageOrIconModule} from '@common/core/ui/image-or-icon/image-or-icon.module';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {LoadingIndicatorModule} from '@common/core/ui/loading-indicator/loading-indicator.module';
import {NotificationButtonComponent} from './notification-button/notification-button.component';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {RouterModule} from '@angular/router';
import {NotificationPanelComponent} from './notification-panel/notification-panel.component';


@NgModule({
    declarations: [
        NotificationListComponent,
        NotificationButtonComponent,
        NotificationPanelComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        ImageOrIconModule,
        MatIconModule,
        MatButtonModule,
        MatBadgeModule,
        LoadingIndicatorModule,
        TranslationsModule,
        MatProgressBarModule,
    ],
    exports: [
        NotificationListComponent,
        NotificationButtonComponent,
    ],
})
export class NotificationListModule {
}
