import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Settings} from '../config/settings.service';
import {LocalizationWithLines} from '../types/localization-with-lines';
import {AppHttpClient} from '../http/app-http-client.service';
import {Localization} from '@common/core/types/models/Localization';
import {BackendResponse} from '@common/core/types/backend-response';

@Injectable({
    providedIn: 'root',
})
export class Localizations {
    constructor(private http: AppHttpClient, private settings: Settings) {}

    /**
     * Get all available  localizations.
     */
    public all(): Observable<{localizations: LocalizationWithLines[]}> {
        return this.http.get('localizations');
    }

    /**
     * Get localization by specified name.
     */
    public get(name: string): Observable<{localization: LocalizationWithLines}> {
        return this.http.get('localizations/' + name);
    }

    /**
     * Create new localization.
     */
    public create(params: object): Observable<{localization: LocalizationWithLines}> {
        return this.http.post('localizations', params);
    }

    /**
     * Update specified localization.
     */
    public update(id: number, params: object): Observable<{localization: LocalizationWithLines}> {
        return this.http.put('localizations/' + id, params);
    }

    /**
     * Delete specified localization.
     */
    public delete(id: number) {
        return this.http.delete('localizations/' + id);
    }

    /**
     * Set specified localization as default for new users.
     */
    public setDefault(localization: Localization): BackendResponse<any> {
        const params = {server: {app_locale: localization.language}};
        return this.settings.save(params);
    }
}
