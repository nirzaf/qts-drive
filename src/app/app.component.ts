import { Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { BrowserEvents } from '@common/core/services/browser-events.service';
import { AppHttpClient } from '@common/core/http/app-http-client.service';
import { Settings } from '@common/core/config/settings.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import cssVars from 'css-vars-ponyfill';
import { CookieNoticeService } from '@common/gdpr/cookie-notice/cookie-notice.service';
import { CustomHomepage } from '@common/pages/shared/custom-homepage.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
    constructor(
        private browserEvents: BrowserEvents,
        private el: ElementRef,
        private http: AppHttpClient,
        private settings: Settings,
        private router: Router,
        private customHomepage: CustomHomepage,
        private cookieNotice: CookieNoticeService,
    ) {}

    ngOnInit() {
        this.browserEvents.subscribeToEvents(this.el.nativeElement);
        this.settings.setHttpClient(this.http);

        // google analytics
        if (this.settings.get('analytics.tracking_code')) {
            this.triggerAnalyticsPageView();
        }

        // custom homepage
        this.customHomepage.select();
        this.loadCssVariablesPolyfill();
        this.cookieNotice.maybeShow();
    }

    private triggerAnalyticsPageView() {
        this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                if ( ! window['ga']) return;
                window['ga']('set', 'page', event.urlAfterRedirects);
                window['ga']('send', 'pageview');
            });
    }

    private loadCssVariablesPolyfill() {
        const isNativeSupport = typeof window !== 'undefined' &&
            window['CSS'] &&
            window['CSS'].supports &&
            window['CSS'].supports('(--a: 0)');
        if ( ! isNativeSupport) {
            cssVars();
        }
    }
}
