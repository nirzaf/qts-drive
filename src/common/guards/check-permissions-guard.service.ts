import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {CurrentUser} from '../auth/current-user';
import {AuthService} from '../auth/auth.service';
import {Settings} from '@common/core/config/settings.service';

@Injectable({
    providedIn: 'root',
})
export class CheckPermissionsGuard implements CanActivate, CanActivateChild {

    constructor(
        private currentUser: CurrentUser,
        private router: Router,
        private auth: AuthService,
        private settings: Settings,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.runAuthCheck(route, state);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.runAuthCheck(route, state);
    }

    private runAuthCheck(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.checkPermissions(route, state);
    }

    private getActiveRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
        while (route.firstChild) route = route.firstChild;
        return route;
    }

    private checkPermissions(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let hasPermission = true;

        if (route.data.permissions) {
            hasPermission = this.currentUser.hasPermissions(route.data.permissions);
        }

        // user can access this route, bail
        if (hasPermission) return true;

        // redirect to login page, if user is not logged in
        if ( ! this.currentUser.isLoggedIn()) {
            this.currentUser.redirectUri = state.url;
            this.router.navigate(['login']);
        } else {
            const uri = this.shouldRedirectToUpgrade(route.data.permissions) ? '/billing/upgrade' : this.auth.getRedirectUri();
            this.router.navigate([uri]);
        }

        return hasPermission;
    }

    private shouldRedirectToUpgrade(permissions: string[]) {
        const goingToAdmin = permissions.length && permissions[0].includes('admin');
        return !goingToAdmin && this.settings.get('billing.enable');
    }
}
