import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from "rxjs";
import {DOCUMENT} from "@angular/common";

//TODO: get default angular XSRF-INTERCEPTOR to work
@Injectable({
    providedIn: 'root'
})
export class XsrfInterceptor implements HttpInterceptor {

    private headerName = 'X-XSRF-TOKEN';

    private lastCookieString: string = '';

    private lastToken: string|null = null;

    constructor(@Inject(DOCUMENT) private doc: any, @Inject(PLATFORM_ID) private platform: string) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const lcUrl = req.url.toLowerCase();

        // Skip both non-mutating requests and absolute URLs.
        // Non-mutating requests don't require a token, and absolute URLs require special handling
        // anyway as the cookie set
        // on our origin is not the same as the token expected by another origin.
        if (req.method === 'GET' || req.method === 'HEAD' || lcUrl.startsWith('http://') ||
            lcUrl.startsWith('https://')) {
            return next.handle(req);
        }

        const token = this.getToken();

        // Be careful not to overwrite an existing header of the same name.
        if (token !== null && !req.headers.has(this.headerName)) {
            req = req.clone({headers: req.headers.set(this.headerName, token)});
        }

        return next.handle(req);
    }

    private getToken(): string|null {
        if (this.platform === 'server') {
            return null;
        }
        const cookieString = this.doc.cookie || '';

        if (cookieString !== this.lastCookieString) {
            this.lastToken = this.parseCookieValue(cookieString, 'XSRF-TOKEN');
            this.lastCookieString = cookieString;
        }

        return this.lastToken;
    }

    private parseCookieValue(cookieStr: string, name: string): string|null {
        name = encodeURIComponent(name);

        for (const cookie of cookieStr.split(';')) {
            const eqIndex = cookie.indexOf('=');

            const [cookieName, cookieValue]: string[] =
                eqIndex == -1 ? [cookie, ''] : [cookie.slice(0, eqIndex), cookie.slice(eqIndex + 1)];

            if (cookieName.trim() === name) {
                return decodeURIComponent(cookieValue);
            }
        }

        return null;
    }
}