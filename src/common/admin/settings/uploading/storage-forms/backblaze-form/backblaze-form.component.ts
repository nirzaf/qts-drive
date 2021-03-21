import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SettingsState} from '../../../settings-state.service';

@Component({
    selector: 'backblaze-form',
    templateUrl: './backblaze-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackblazeFormComponent {
    constructor(public state: SettingsState) {}
}
