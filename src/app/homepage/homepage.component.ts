import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Settings } from '@common/core/config/settings.service';
import { Subscription } from 'rxjs';
import { HomepageContent } from './homepage-content';
import { DomSanitizer } from '@angular/platform-browser';
import { Translations } from '@common/core/translations/translations.service';

@Component({
    selector: 'homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomepageComponent implements OnInit, OnDestroy {
    public content: HomepageContent;
    public overlayBackground;
    private sub: Subscription;

    constructor(
        public settings: Settings,
        private cd: ChangeDetectorRef,
        private sanitizer: DomSanitizer,
        private i18n: Translations,
    ) {}

    ngOnInit() {
        this.sub = this.settings.all$().subscribe(() => {
            this.content = this.settings.getJson('homepage.appearance');
            this.overlayBackground = this.sanitizer.bypassSecurityTrustStyle(
                `linear-gradient(45deg, ${this.content.headerOverlayColor1} 0%, ${this.content.headerOverlayColor2} 100%)`
            );
            this.cd.markForCheck();
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    public scrollToFeatures() {
        document.querySelector('.inline-features')
            .scrollIntoView({block: 'start', inline: 'center', behavior: 'smooth'});
    }

    public copyrightText() {
        const year = (new Date()).getFullYear();
        return this.i18n.t('Copyright © :year, All Rights Reserved', {year});
    }
}
