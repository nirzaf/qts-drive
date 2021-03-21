import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Settings } from '../core/config/settings.service';
import {LocalStorage} from '@common/core/services/local-storage.service';
import {ONBOARDING_LOCAL_STORAGE_KEY} from '@common/billing/upgrade-page/upgrade-page.component';

@Injectable({
    providedIn: 'root',
})
export class DisableRouteGuard implements CanActivate {

    constructor(
        private settings: Settings,
        private router: Router,
        private localStorage: LocalStorage,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.settings.get('registration.disable') || this.localStorage.get(ONBOARDING_LOCAL_STORAGE_KEY)) {
            return true;
        }

        this.router.navigate(['/login']);

        return false;
    }
}
