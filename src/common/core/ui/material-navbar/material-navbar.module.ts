import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoggedInUserWidgetComponent} from '@common/core/ui/logged-in-user-widget/logged-in-user-widget.component';
import {LoggedInUserMenuComponent} from '@common/core/ui/logged-in-user-widget/logged-in-user-menu/logged-in-user-menu.component';
import {MaterialNavbar} from '@common/core/ui/material-navbar/material-navbar.component';
import {RouterModule} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {CustomMenuModule} from '@common/core/ui/custom-menu/custom-menu.module';
import {NotificationListModule} from '@common/notifications/notification-list/notification-list.module';
import { TranslationsModule } from '@common/core/translations/translations.module';


@NgModule({
    declarations: [
        LoggedInUserWidgetComponent,
        LoggedInUserMenuComponent,
        MaterialNavbar,
    ],
    imports: [
        CommonModule,
        RouterModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        CustomMenuModule,
        TranslationsModule,
        NotificationListModule,
    ],
    exports: [
        MaterialNavbar,
        LoggedInUserMenuComponent,
        CustomMenuModule,
    ]
})
export class MaterialNavbarModule {
}
