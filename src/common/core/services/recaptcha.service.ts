import {Injectable} from '@angular/core';
import {Settings} from '../config/settings.service';
import {LazyLoaderService} from '../utils/lazy-loader.service';
import {AppHttpClient} from '../http/app-http-client.service';
import {GenericBackendResponse} from '@common/core/types/backend-response';
import {Router} from '@angular/router';
import {Toast} from '@common/core/ui/toast.service';

declare var grecaptcha: any;
const RECAPTCHA_URL = 'https://www.google.com/recaptcha/api.js?render=';

@Injectable({
    providedIn: 'root'
})
export class RecaptchaService {
    constructor(
        private settings: Settings,
        private http: AppHttpClient,
        private lazyLoader: LazyLoaderService,
        private router: Router,
        private toast: Toast,
    ) {}

    public enabledFor(page: string) {
        return !this.router.url.includes('admin') &&
            this.settings.get('recaptcha.site_key') &&
            this.settings.get('recaptcha.secret_key') &&
            this.settings.get(`recaptcha.enable_for_${page}`);
    }

    public loadIfEnableFor(page: string) {
        if (this.enabledFor(page)) {
            return this.load();
        }
    }

    public load() {
        return this.lazyLoader
            .loadAsset(RECAPTCHA_URL + this.settings.get('recaptcha.site_key'), {type: 'js'});
    }

    public async verify(action: string): Promise<boolean> {
        if ( ! window['grecaptcha'] || ! this.enabledFor(action)) {
            return true;
        }
        const isValid = await this.callRecaptcha(action);
        if ( ! isValid) {
            this.toast.open('Could not verify you are human.');
        }
        return isValid;
    }

    private callRecaptcha(action: string): Promise<boolean> {
        return new Promise(async resolve => {
            await this.load();
            window['grecaptcha'].ready(async () => {
                const token = await grecaptcha.execute(this.settings.get('recaptcha.site_key'), {action});
                this.http.post<GenericBackendResponse<{success: boolean}>>('recaptcha/verify', {token})
                    .subscribe(response => resolve(response.success));
            });
        });
    }
}
