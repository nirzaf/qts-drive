import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LinkOverlayService} from '../link-overlay/link-overlay.service';
import {ActiveWorkspace} from './active-workspace.service';
import {LinkService} from '../../shared/link/link.service';
import {LinkGroupService} from '../../shared/link/link-group.service';
import {CustomDomainService} from '@common/custom-domain/custom-domain.service';
import {TrackingPixelService} from '../pixels/tracking-pixel.service';
import {LINK_PAGE_BASE_URI} from '../link-page-base-uri';
import {CurrentUser} from '@common/auth/current-user';
import {Router} from '@angular/router';
import {LINK_USAGE_BASE_URI} from '../../shared/link/link-usage.service';

const WORKSPACED_ENDPOINTS = [
    LinkService.BASE_URI,
    LinkGroupService.BASE_URI,
    CustomDomainService.BASE_URI,
    LinkOverlayService.BASE_URI,
    LINK_PAGE_BASE_URI,
    TrackingPixelService.BASE_URI,
    LINK_USAGE_BASE_URI,
];

@Injectable()
export class WorkspacedResourceInterceptor implements HttpInterceptor {
    constructor(
        private activeWorkspace: ActiveWorkspace,
        private currentUser: CurrentUser,
        private router: Router,
    ) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // if (WORKSPACED_ENDPOINTS.includes(request.url.replace('secure/', ''))) {
        //     if (['POST', 'PUT', 'DELETE'].includes(request.method) && this.activeWorkspace.id) {
        //         request = this.overridePostBody(request);
        //     } else if (request.method === 'GET') {
        //         request = this.overrideQueryParams(request);
        //     }
        // }
        return next.handle(request);
    }

    private overridePostBody(request: HttpRequest<unknown>) {
        const workspaceId = '' + this.activeWorkspace.id;
        const newBody = request.body instanceof FormData ?
            request.body.append('workspaceId', workspaceId) :
            {...(request.body as object), workspaceId};

        return request.clone({
            body: newBody
        });
    }

    private overrideQueryParams(request: HttpRequest<unknown>) {
        return request.clone({
            setParams: {
                workspaceId: (this.activeWorkspace.id || '') as string,
                userId: (this.filterByUser() ? this.currentUser.get('id') : '') as string,
            }
        });
    }

    public filterByUser(): boolean {
        return this.router.url.indexOf('admin') === -1;
    }
}
