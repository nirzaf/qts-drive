import {Injectable} from '@angular/core';
import {SettingsPayload} from '../../core/config/settings-payload';

@Injectable({
    providedIn: 'root'
})
export class SettingsState {
    public initial: SettingsPayload = {server: {}, client: {}};
    public server: {[key: string]: string|number} = {};
    public client: {[key: string]: string|number} = {};

    public getModified() {
        return {
            server: this.diffSettingObjects('server'),
            client: this.diffSettingObjects('client'),
        } as SettingsPayload;
    }

    private diffSettingObjects(name: string): Object {
        const changed = {};

        for (const key in this[name]) {
            if (this[name][key] !== this.initial[name][key]) {
                changed[key] = this[name][key];
            }
        }

        return changed;
    }

    public setAll(settings: SettingsPayload) {
        this.initial = settings;
        this.client = {...settings.client};
        this.server = {...settings.server};
    }

    public reset() {
        this.server = {...this.initial.server};
        this.client = {...this.initial.client};
    }

    public updateInitial(changedSettings: SettingsPayload) {
        this.initial = {
            client: {...this.initial.client, ...changedSettings.client},
            server: {...this.initial.server, ...changedSettings.server},
        };
    }
}
