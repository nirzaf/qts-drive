import {Injectable} from '@angular/core';
import {Router, Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {Users} from '../auth/users.service';
import {SelectOptionLists, ValueLists} from '../core/services/value-lists.service';
import {User} from '../core/types/models/User';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {EMPTY, forkJoin, Observable, of} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import { CurrentUser } from '../auth/current-user';

export interface AccountSettingsResolverData {
    user: User;
    selects: SelectOptionLists;
}

@Injectable({
    providedIn: 'root',
})
export class AccountSettingsResolve implements Resolve<AccountSettingsResolverData> {

    constructor(
        private users: Users,
        private router: Router,
        private currentUser: CurrentUser,
        private values: ValueLists,
        private auth: AuthService,
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<AccountSettingsResolverData> {
        return forkJoin([
            this.users.get(this.currentUser.get('id')).pipe(map(response => response.user)),
            this.values.get(['timezones', 'countries', 'localizations']),
        ]).pipe(
            catchError(() => {
                this.router.navigate([this.auth.getRedirectUri()]);
                return EMPTY;
            }),
            mergeMap(response => {
                if (response) {
                    return of({user: response[0], selects: response[1]});
                } else {
                    this.router.navigate([this.auth.getRedirectUri()]);
                    return EMPTY;
                }
            })
        );
    }
}
