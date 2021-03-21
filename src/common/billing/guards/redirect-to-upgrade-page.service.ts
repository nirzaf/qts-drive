import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {CurrentUser} from '../../auth/current-user';
import {AppearanceListenerService} from '../../shared/appearance/appearance-listener.service';

@Injectable({
    providedIn: 'root',
})
export class RedirectToUpgradePage implements CanActivate {
    constructor(
        private currentUser: CurrentUser,
        private router: Router,
        private listener: AppearanceListenerService,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.listener.active) {
            return true;
        }
        if (this.currentUser.isSubscribed()) {
            this.router.navigate(['billing/subscription']);
            return false;
        } else if (this.currentUser.isLoggedIn()) {
            this.router.navigate(['billing/upgrade']);
            return false;
        }
        return true;
    }
}
