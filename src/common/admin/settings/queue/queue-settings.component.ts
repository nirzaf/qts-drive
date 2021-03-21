import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SettingsPanelComponent} from '@common/admin/settings/settings-panel.component';

@Component({
    selector: 'queue-settings',
    templateUrl: './queue-settings.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'settings-panel'},
})
export class QueueSettingsComponent extends SettingsPanelComponent {
    public saveSettings() {
        const settings = this.state.getModified();

        // need to save pusher key to both .env file and database
        // because it is used on server side and on client side
        if (settings.client['realtime.pusher_key']) {
            settings.server['pusher_key'] = settings.client['realtime.pusher_key'];
        }

        super.saveSettings(settings);
    }
}
