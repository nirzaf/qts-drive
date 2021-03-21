import {RouterModule, Routes} from '@angular/router';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {NgModule} from '@angular/core';
import {LoginComponent} from './login/login.component';
import {GuestGuard} from '../guards/guest-guard.service';
import {RegisterComponent} from './register/register.component';
import {DisableRouteGuard} from '../guards/disable-route-guard.service';
import {ResetPasswordComponent} from './reset-password/reset-password.component';

const routes: Routes = [
    {path: 'login', component: LoginComponent, canActivate: [GuestGuard]},
    {path: 'register', component: RegisterComponent, canActivate: [GuestGuard, DisableRouteGuard]},
    {path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [GuestGuard]},
    {path: 'password/reset/:token', component: ResetPasswordComponent, canActivate: [GuestGuard]},

    {path: 'workspace/join/register', component: RegisterComponent, data: {message: 'To join your team on :siteName, create an account'}},
    {path: 'workspace/join/login', component: LoginComponent, data: {message: 'To join your team on :siteName, login to your account'}},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {
}
