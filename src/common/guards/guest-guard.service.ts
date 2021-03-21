import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {CurrentUser} from '../auth/current-user';
import {Settings} from '../core/config/settings.service';
import {AppearanceListenerService} from '../shared/appearance/appearance-listener.service';

@Injectable({
    providedIn: 'root',
})
export class GuestGuard implements CanActivate {
    constructor(
        private currentUser: CurrentUser,
        private auth: AuthService,
        private router: Router,
        private settings: Settings,
        private listener: AppearanceListenerService,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // allow to view guest pages in appearance editor
        if (this.listener.active) return true;

        // user is not logged in
        if ( ! this.currentUser.isLoggedIn()) return true;

        this.router.navigate([this.auth.getRedirectUri()]);

        return false;
    }
}
