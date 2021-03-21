import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SettingsState} from '../../../settings-state.service';

@Component({
    selector: 'rackspace-form',
    templateUrl: './rackspace-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RackspaceFormComponent {
    constructor(public state: SettingsState) {}
}
