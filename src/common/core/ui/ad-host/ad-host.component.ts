import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewEncapsulation
} from '@angular/core';
import {Settings} from '@common/core/config/settings.service';
import {CurrentUser} from '@common/auth/current-user';
import {LazyLoaderService} from '@common/core/utils/lazy-loader.service';
import {randomString} from '@common/core/utils/random-string';

@Component({
    selector: 'ad-host',
    templateUrl: './ad-host.component.html',
    styleUrls: ['./ad-host.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdHostComponent implements OnInit, OnDestroy {
    @Input() public slot: string;

    @HostBinding('id') public randomId: string;
    private adCode: string;

    constructor(
        private el: ElementRef<HTMLElement>,
        private renderer: Renderer2,
        private settings: Settings,
        private currentUser: CurrentUser,
        private lazyLoader: LazyLoaderService,
    ) {}

    ngOnInit() {
        if (this.settings.get('ads.disable') || this.currentUser.isSubscribed()) return;

        this.randomId = randomString();
        this.adCode = this.settings.get(this.slot);
        if ( ! this.adCode) return;

        this.addClassToHost();
        this.appendAdHtml();
        this.loadAdScripts().then(() => {
            this.executeAdJavascript();
        });
    }

    private addClassToHost() {
        const className = `${this.slot.replace(/\./g, '-')}-host`;
        this.el.nativeElement.classList.add(className);
    }

    ngOnDestroy() {
        delete window['google_ad_modifications'];
    }

    /**
     * Extract and append any non-javascript html tags from ad code.
     */
    private appendAdHtml() {
        // strip out all script tags from ad code and leave only html
        const adHtml = this.adCode.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
        if (adHtml) {
            this.el.nativeElement.innerHTML = adHtml;
        }
    }

    /**
     * Execute ad code javascript and replace document.write if needed.
     */
    private executeAdJavascript() {
        // find any ad code javascript that needs to be executed
        const pattern = /<script\b[^>]*>([\s\S]*?)<\/script>/g;
        let content;

        while (content = pattern.exec(this.adCode)) {
            if (content[1]) {
                const r = "var d = document.createElement('div'); d.innerHTML = $1; document.getElementById('"+this.randomId+"').appendChild(d.firstChild);";
                const toEval = content[1].replace(/document.write\((.+?)\);/, r);
                eval(toEval);
            }
        }
    }

    /**
     * Load any external scripts needed by ad.
     */
    private loadAdScripts(): Promise<any> {
        const promises = [];

        // load ad code script
        const pattern = /<script.*?src=['"](.*?)['"]/g;
        let match;

        while (match = pattern.exec(this.adCode)) {
            if (match[1]) {
                promises.push(this.lazyLoader.loadAsset(match[1], {type: 'js', parentEl: this.el.nativeElement}));
            }
        }

        return Promise.all(promises);
    }
}
