import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild} from '@angular/router';
import {CurrentUser} from '../../auth/current-user';

@Injectable({
    providedIn: 'root'
})
export class UserNotSubscribedGuard implements CanActivate, CanActivateChild {

    constructor(private currentUser: CurrentUser, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.handle();
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.handle();
    }

    private handle() {
        if ( ! this.currentUser.isSubscribed()) { return true; }

        this.router.navigate(['/billing/subscription']);

        return false;
    }
}
