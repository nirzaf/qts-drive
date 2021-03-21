import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpParams, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, filter} from 'rxjs/operators';
import {HttpErrorHandler} from '@common/core/http/errors/http-error-handler.service';

@Injectable({
    providedIn: 'root'
})
export class AppHttpClient {
    static prefix = 'secure';

    constructor(protected httpClient: HttpClient, protected errorHandler: HttpErrorHandler) {}

    public get<T>(uri: string, params = {}, options: object = {}): Observable<T> {
        const httpParams = this.transformQueryParams(params);
        return this.httpClient.get<T>(this.prefixUri(uri), {params: httpParams, ...options})
            .pipe(catchError(err => this.errorHandler.handle(err, uri, options)));
    }

    public post<T>(uri: string, payload: object = null): Observable<T> {
        return this.httpClient.post<T>(this.prefixUri(uri), payload)
            .pipe(catchError(err => this.errorHandler.handle(err, uri)));
    }

    public put<T>(uri: string, payload: object = {}): Observable<T> {
        payload = this.spoofHttpMethod(payload, 'PUT');
        return this.httpClient.post<T>(this.prefixUri(uri), payload)
            .pipe(catchError(err => this.errorHandler.handle(err, uri)));
    }

    public delete<T>(uri: string, payload: object = {}): Observable<T> {
        payload = this.spoofHttpMethod(payload, 'DELETE');
        return this.httpClient.post<T>(this.prefixUri(uri), payload)
            .pipe(catchError(err => this.errorHandler.handle(err, uri)));
    }

    public postWithProgress(uri: string, params: FormData) {
        const req = new HttpRequest('POST', this.prefixUri(uri), params, {
            reportProgress: true
        });
        return this.httpClient.request(req).pipe(
            catchError(err => this.errorHandler.handle(err, uri)),
            filter(e => [HttpEventType.Sent, HttpEventType.UploadProgress, HttpEventType.Response].includes(e.type))
        );
    }

    protected prefixUri(uri: string) {
        if (uri.indexOf('://') > -1 || uri.startsWith(AppHttpClient.prefix) || uri.startsWith('api')) {
            return uri;
        }
        return `${AppHttpClient.prefix}/${uri}`;
    }

    protected transformQueryParams(params: object|null) {
        let httpParams = new HttpParams();

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                httpParams = httpParams.append(key, value == null ? '' : value);
            });
        }

        return httpParams;
    }

    protected spoofHttpMethod(params: object|FormData, method: 'PUT'|'DELETE'): object|FormData {
        if (params instanceof FormData) {
            (params as FormData).append('_method', method);
        } else {
            params['_method'] = method;
        }

        return params;
    }
}
