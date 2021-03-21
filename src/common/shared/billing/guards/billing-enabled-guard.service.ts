import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild} from '@angular/router';
import {Settings} from '@common/core/config/settings.service';

@Injectable({
    providedIn: 'root',
})
export class BillingEnabledGuard implements CanActivate, CanActivateChild {
    constructor(private settings: Settings, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.handle();
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.handle();
    }

    private handle() {
        if (this.settings.get('billing.integrated') && this.settings.get('billing.enable')) {
            return true;
        }

        this.router.navigate(['/']);
        return false;
    }
}
