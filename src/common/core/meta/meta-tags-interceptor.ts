import { Injectable } from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';
import {MetaTagsService} from './meta-tags.service';

@Injectable({
    providedIn: 'root'
})
export class MetaTagsInterceptor implements HttpInterceptor {
    constructor(private metaTags: MetaTagsService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(tap(e => {
            if (e instanceof HttpResponse && e.body && e.body.seo) {
                this.metaTags.latestMetaTags$.next(e.body.seo);
            }
            return e;
        }));
    }
}
