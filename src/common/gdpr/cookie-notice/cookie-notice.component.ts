import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Settings} from '@common/core/config/settings.service';
import {OverlayPanelRef} from '@common/core/ui/overlay-panel/overlay-panel-ref';

@Component({
    selector: 'cookie-notice',
    templateUrl: './cookie-notice.component.html',
    styleUrls: ['./cookie-notice.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CookieNoticeComponent {
    constructor(
        public settings: Settings,
        private overlayRef: OverlayPanelRef<CookieNoticeComponent>,
    ) {}

    public hideNotice() {
        const now = new Date(),
            exdate = new Date(),
            expireIn = exdate.setDate(exdate.getDate() + 30);
        exdate.setTime(now.getTime() + expireIn);
        document.cookie = `${this.settings.get('branding.site_name')}_cookie_notice=1; expires=${exdate.toUTCString()}; path=/;`;
        this.overlayRef.close();
    }
}
