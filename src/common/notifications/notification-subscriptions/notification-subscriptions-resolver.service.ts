import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {catchError, mergeMap} from 'rxjs/operators';
import {EMPTY, Observable, of} from 'rxjs';
import {NotificationSubscriptionsService} from '@common/notifications/notification-subscriptions/notification-subscriptions.service';
import {CurrentUser} from '@common/auth/current-user';
import {NotificationSubscriptionsResponse} from '@common/notifications/notification-subscriptions/notification-subscription';

@Injectable({
    providedIn: 'root'
})
export class NotificationSubscriptionsResolverService implements Resolve<Observable<NotificationSubscriptionsResponse>> {
    constructor(
        private router: Router,
        private subscriptions: NotificationSubscriptionsService,
        private currentUser: CurrentUser,
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<NotificationSubscriptionsResponse> {
        return this.subscriptions.getAll(+this.currentUser.get('id')).pipe(
            catchError(() => {
                this.router.navigate(['/account/settings']);
                return EMPTY; //
            }),
            mergeMap(response => {
                if (response) {
                    return of(response);
                } else {
                    this.router.navigate(['/account/settings']);
                    return EMPTY;
                }
            })
        );
    }
}
