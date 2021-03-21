import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SettingsPanelComponent } from '@common/admin/settings/settings-panel.component';

@Component({
  selector: 'drive-settings',
  templateUrl: './drive-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'class': 'settings-panel'},
})
export class DriveSettingsComponent extends SettingsPanelComponent {
}
