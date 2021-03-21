import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuard} from '../guards/auth-guard.service';
import {AccountSettingsComponent} from './account-settings.component';
import {AccountSettingsResolve} from './account-settings-resolve.service';
import {CheckPermissionsGuard} from '@common/guards/check-permissions-guard.service';

const routes: Routes = [
    // TODO: reloading if already in "account/settings" ads "settings" again to url if uncommented
    // {
    //     path: 'account',
    //     pathMatch: 'full',
    //     redirectTo: 'account/settings'
    // },
    {
        path: 'account/settings',
        component: AccountSettingsComponent,
        resolve: {api: AccountSettingsResolve},
        canActivate: [AuthGuard, CheckPermissionsGuard],
        data: {name: 'account-settings'},
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountSettingsRoutingModule {
}
