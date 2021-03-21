import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SettingsPanelComponent} from '../settings-panel.component';

@Component({
    selector: 'logging-settings',
    templateUrl: './logging-settings.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'settings-panel'},
})
export class LoggingSettingsComponent extends SettingsPanelComponent {
}
