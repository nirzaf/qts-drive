import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SettingsPanelComponent} from '../settings-panel.component';

@Component({
    selector: 'mail-settings',
    templateUrl: './mail-settings.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'settings-panel'},
})
export class MailSettingsComponent extends SettingsPanelComponent {}
