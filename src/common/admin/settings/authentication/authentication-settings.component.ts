import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {SettingsPanelComponent} from '../settings-panel.component';

@Component({
    selector: 'authentication-settings',
    templateUrl: './authentication-settings.component.html',
    styleUrls: ['./authentication-settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'settings-panel'},
})
export class AuthenticationSettingsComponent extends SettingsPanelComponent {}
