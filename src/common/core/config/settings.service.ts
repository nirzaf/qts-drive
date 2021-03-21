import {Injectable} from '@angular/core';
import {AppConfig} from './app-config';
import * as Dot from 'dot-object';
import merge from 'deepmerge';
import {AppHttpClient} from '../http/app-http-client.service';
import {objToFormData} from '../utils/obj-to-form-data';
import {SettingsJsonPayload, SettingsPayload} from './settings-payload';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class Settings {
    private http: AppHttpClient;
    private config$ = new BehaviorSubject<AppConfig>({});
    public csrfToken: string;

    public setMultiple(settings: AppConfig) {
        if ( ! settings) return;
        const newConfig = {...this.config$.value};
        Object.entries(settings).forEach(([key, value]) => {
            if (value === '0' || value === '1') {
                value = parseInt(value);
            }
            Dot.set(key, value, newConfig);
        });
        this.config$.next(newConfig);
    }

    public merge(config: object) {
        this.config$.next(merge(this.config$.value, config));
    }

    public set(name: keyof AppConfig|any, value: AppConfig[keyof AppConfig]|any) {
        const newConfig = {...this.config$.value};
        Dot.set(name, value, newConfig);
        this.config$.next(newConfig);
    }

    public replace(config: AppConfig) {
        this.config$.next(config);
    }

    public get(name: keyof AppConfig|any, defaultValue: any = null): any {
        const value = Dot.pick(name, this.config$.value);
        if (value == null) {
            return defaultValue;
        } else {
            return value;
        }
    }

    public getFlat(name?: string) {
        return Dot.dot(name ? this.config$.value[name] : this.config$.value);
    }

    public all$() {
        return this.config$.asObservable();
    }

    public getAll() {
        return this.config$.value;
    }

    public has(name: keyof AppConfig): boolean {
        return !!Dot.pick(name as string, this.config$.value);
    }

    /**
     * Get a json setting by key and decode it.
     */
    public getJson(name: keyof AppConfig, defaultValue: any = null) {
        const value = this.get(name, defaultValue);
        if (typeof value !== 'string') return value;
        return JSON.parse(value);
    }

    /**
     * Get base url for the app.
     */
    public getBaseUrl(forceServerUrl = false): string {
        // sometimes we might need to get base url supplied by backend
        // even in development environment, for example, to prevent
        // uploaded images from having proxy urls like "localhost:4200"
        if (this.has('base_url') && (this.get('vebto.environment') === 'production' || forceServerUrl)) {
            return this.get('base_url') + '/';
        } else if (document.querySelector('base')) {
            return document.querySelector('base')['href'];
        } else {
            // 'https://site.com/subdomain/index.html/" => 'https://site.com/subdomain/'
            const url = window.location.href.split('?')[0];
            return url.replace(/([^\/]+\.\w+($|\/$))/, '');
        }
    }

    /**
     * Get app's asset base url.
     */
    public getAssetUrl(suffix?: string, forceServerUrl = false): string {
        let uri = (this.get('vebto.assetsUrl') || this.getBaseUrl(forceServerUrl));
        const prefix = this.get('vebto.assetsPrefix');

        // in production assets will be in "client" sub-folder
        if (this.get('vebto.environment') === 'production' && prefix) {
            uri += prefix + '/';
        }

        uri += 'assets/';

        if (suffix) uri += suffix;

        return uri;
    }

    /**
     * Save specified setting on the server.
     */
    public save(settings: SettingsPayload) {
        this.setMultiple(settings.client);
        const jsonSettings = {files: settings.files} as SettingsJsonPayload;
        // need to encode settings as json to preserve
        // booleans as form data will always be a string
        // also need to encode as base64 to make sure requests
        // are not blocked when setting contains <scripts>
        jsonSettings.client = JSON.stringify(settings.client);
        jsonSettings.server = JSON.stringify(settings.server);
        const data = objToFormData(jsonSettings);
        return this.http.post('settings', data);
    }

    /**
     * Check if any social login is enabled.
     */
    public anySocialLoginEnabled() {
        const names = ['facebook', 'google', 'twitter'];
        return names.filter(name => this.get('social.' + name + '.enable')).length > -1;
    }

    /**
     * Set HttpClient instance.
     */
    public setHttpClient(http: AppHttpClient) {
        this.http = http;
    }
}
