import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SettingsState} from '../../../settings-state.service';

@Component({
    selector: 'digitalocean-form',
    templateUrl: './digitalocean-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DigitaloceanFormComponent {
    constructor(public state: SettingsState) {}
}
