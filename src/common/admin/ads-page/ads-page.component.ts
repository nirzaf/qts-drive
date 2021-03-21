import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {AdSlotConfig} from '@common/core/config/app-config';
import {FormBuilder} from '@angular/forms';
import {Settings} from '@common/core/config/settings.service';
import {Toast} from '@common/core/ui/toast.service';
import {HttpErrors} from '@common/core/http/errors/http-errors.enum';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'ads-page',
    templateUrl: './ads-page.component.html',
    styleUrls: ['./ads-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdsPageComponent implements OnInit {
    public loading$ = new BehaviorSubject(false);
    public form = this.fb.group({
        'ads.disable': [false],
    });

    constructor(
        public settings: Settings,
        private toast: Toast,
        private fb: FormBuilder,
    ) {}

    ngOnInit() {
        this.hydrate();
    }

    public saveAds() {
        this.loading$.next(true);
        this.settings.save({client: this.form.value})
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(() => {
                this.toast.open('Ads updated');
            }, () => {
                this.toast.open(HttpErrors.Default);
            });
    }

    public allAds() {
        return this.settings.get('vebto.admin.ads', []) as AdSlotConfig[];
    }

    public getPreviewUrl(config: AdSlotConfig): string {
        // ads.splash.top => splash-top
        const name = config.slot.replace(/\./g, '-').replace('ads-', '');
        return `client/assets/images/verts/${name}.png`;
    }

    private hydrate() {
        const settings = this.settings.getFlat() || {};
        this.form.patchValue({'ads.disable': settings['ads.disable']});
        this.allAds().forEach(ad => {
            this.form.addControl(ad.slot, this.fb.control(settings[ad.slot]));
        });
    }
}
