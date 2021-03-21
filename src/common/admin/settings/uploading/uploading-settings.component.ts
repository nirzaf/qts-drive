import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SettingsPanelComponent } from '../settings-panel.component';
import { GenericBackendResponse } from '@common/core/types/backend-response';
import { Subject } from 'rxjs';

@Component({
    selector: 'uploading-settings',
    templateUrl: './uploading-settings.component.html',
    styleUrls: ['./uploading-settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'settings-panel'},
})
export class UploadingSettingsComponent extends SettingsPanelComponent implements OnInit {
    public allowedExtensions: string[] = [];
    public blockedExtensions: string[] = [];
    public serverMaxUploadSize$ = new Subject<string>();

    ngOnInit() {
        this.allowedExtensions = this.settings.getJson('uploads.allowed_extensions', []);
        this.blockedExtensions = this.settings.getJson('uploads.blocked_extensions', []);
        this.getServerMaxUploadSize();
    }

    public saveSettings() {
        this.setJson('uploads.allowed_extensions', removeLeadingDot(this.allowedExtensions));
        this.setJson('uploads.blocked_extensions', removeLeadingDot(this.blockedExtensions));
        super.saveSettings();
    }

    public driverSelected(name: string): boolean {
        return [this.state.server.uploads_disk_driver, this.state.server.public_disk_driver]
            .includes(name);
    }

    public allSelectedDriversAreLocal() {
        return [this.state.server.uploads_disk_driver, this.state.server.public_disk_driver]
            .every(d => !d || d === 'local');
    }

    private getServerMaxUploadSize() {
        this.http.get<GenericBackendResponse<{maxSize: string}>>('uploads/server-max-file-size').subscribe(response => {
            this.serverMaxUploadSize$.next(response.maxSize);
        });
    }
}

function removeLeadingDot(values: string[]) {
    return values.map(v => v.replace(/^\./, ''));
}
