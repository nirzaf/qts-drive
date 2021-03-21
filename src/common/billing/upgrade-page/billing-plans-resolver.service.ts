import {Injectable} from '@angular/core';
import {Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, Router} from '@angular/router';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {EMPTY, Observable, of} from 'rxjs';
import {Plan} from '@common/core/types/models/Plan';
import {Plans} from '@common/shared/billing/plans.service';

@Injectable({
    providedIn: 'root'
})
export class BillingPlansResolver implements Resolve<Plan[]> {
    constructor(
        private plans: Plans,
        private router: Router
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Plan[]> {
        return this.plans.all({order: 'position|asc', perPage: 30})
            .pipe(map(response => response.pagination.data))
            .pipe(
                catchError(() => {
                    this.router.navigateByUrl('/');
                    return EMPTY;
                }),
                mergeMap((plans: Plan[]) => {
                    return of(plans);
                })
            );
    }
}

