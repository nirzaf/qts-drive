import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NotificationSubscriptionsComponent} from './notification-subscriptions/notification-subscriptions.component';
import {NotificationSubscriptionsResolverService} from './notification-subscriptions/notification-subscriptions-resolver.service';
import {NotificationPageComponent} from '@common/notifications/notification-page/notification-page.component';


const routes: Routes = [
    {
        path: '',
        component: NotificationPageComponent,
    },
    {
        path: 'settings',
        component: NotificationSubscriptionsComponent,
        resolve: {api: NotificationSubscriptionsResolverService},
        data: {permissions: ['notification.subscribe']},
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NotificationsRoutingModule {
}
