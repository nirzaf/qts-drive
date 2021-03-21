import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {share} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {HttpErrorHandler} from './errors/http-error-handler.service';
import { AppHttpClient } from './app-http-client.service';

@Injectable({
    providedIn: 'root'
})
export class HttpCacheClient extends AppHttpClient {
    protected cache = {};

    constructor(
        protected http: HttpClient,
        protected errorHandler: HttpErrorHandler,
    ) {
        super(http, errorHandler);
    }

    public getWithCache<T>(url: string, params: Object = {}): Observable<T> {
        const key = this.makeCacheKey(url, params);

        // this request is in progress and not yet resolved,
        // we can return same observable for all callers
        if (this.cache[key] instanceof Observable) {
            return this.cache[key];

        // this request is completed and cached, we can return cached response
        } else if (this.cache[key]) {
            return of(this.cache[key]);

        // this request was not made yet, so we make a new one
        } else {
            const request = this.get(url, params).pipe(share()) as any;
            request.subscribe(data => this.cache[key] = data, () => {});
            return this.cache[key] = request;
        }
    }

    public post<T>(url: string, params?, headers?): Observable<T> {
        this.clearCache();
        return super.post(url, params);
    }

    public put<T>(url: string, params = {}, headers?): Observable<T> {
        this.clearCache();
        return super.put(url, params);
    }

    public delete<T>(url: string, params = {}, headers?): Observable<T> {
        this.clearCache();
        return super.delete(url, params);
    }

    public clearCache() {
        this.cache = {};
    }

    private makeCacheKey(url: string, params?): string {
        return url + JSON.stringify(params);
    }
}
