import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SettingsState} from '../../../settings-state.service';

@Component({
    selector: 'ftp-form',
    templateUrl: './ftp-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FtpFormComponent {
    constructor(public state: SettingsState) {}
}
