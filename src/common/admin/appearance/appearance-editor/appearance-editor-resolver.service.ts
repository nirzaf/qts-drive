import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {catchError, mergeMap} from 'rxjs/operators';
import {EMPTY, Observable, of} from 'rxjs';
import {GenericBackendResponse} from '@common/core/types/backend-response';
import {AppHttpClient} from '@common/core/http/app-http-client.service';

@Injectable({
    providedIn: 'root'
})
export class AppearanceEditorResolver implements Resolve<GenericBackendResponse<{[key: string]: any}>> {
    constructor(
        private router: Router,
        private http: AppHttpClient
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<GenericBackendResponse<{[key: string]: any}>> {
        return this.http.get<GenericBackendResponse<{[key: string]: any}>>('admin/appearance/values').pipe(
            catchError(() => {
                this.router.navigate(['/admin']);
                return EMPTY;
            }),
            mergeMap(response => {
                if (response) {
                    return of(response);
                } else {
                    this.router.navigate(['/admin']);
                    return EMPTY;
                }
            })
        );
    }
}

