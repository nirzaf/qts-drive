import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { GuestGuard } from '@common/guards/guest-guard.service';
import { ContactComponent } from '@common/contact/contact.component';
import { NOT_FOUND_ROUTES } from '@common/pages/not-found-routes';

const routes: Routes = [
    {path: '', pathMatch: 'full', component: HomepageComponent, canActivate: [GuestGuard]},
    {path: 'admin', loadChildren: () => import('src/app/admin/app-admin.module').then(m => m.AppAdminModule)},
    {path: 'drive', loadChildren: () => import('src/app/drive/drive.module').then(m => m.DriveModule)},
    {path: 'billing', loadChildren: () => import('@common/billing/billing.module').then(m => m.BillingModule)},
    {path: 'notifications', loadChildren: () => import('@common/notifications/notifications.module').then(m => m.NotificationsModule)},
    {path: 'api-docs', loadChildren: () => import('@common/api-docs/api-docs.module').then(m => m.ApiDocsModule)},
    {path: 'contact', component: ContactComponent},

    ...NOT_FOUND_ROUTES,
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
