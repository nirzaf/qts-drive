import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SettingsPanelComponent} from '@common/admin/settings/settings-panel.component';
import {SettingsPayload} from '@common/core/config/settings-payload';

@Component({
    selector: 'analytics-settings',
    templateUrl: './analytics-settings.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'settings-panel'},
})
export class AnalyticsSettingsComponent extends SettingsPanelComponent {
    public certificateFile: File;

    public saveSettings(settings?: SettingsPayload) {
        const payload = this.getPayload(settings || this.state.getModified());
        super.saveSettings(payload);
    }

    private getPayload(settings: SettingsPayload) {
        if (this.certificateFile) {
            settings.files = {certificate: this.certificateFile};
        }
        return settings;
    }

    public setCertificateFile(files: FileList) {
        this.certificateFile = files.item(0);
    }
}
