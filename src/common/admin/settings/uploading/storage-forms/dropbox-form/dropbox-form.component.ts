import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SettingsState} from '../../../settings-state.service';

@Component({
    selector: 'dropbox-form',
    templateUrl: './dropbox-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropboxFormComponent {
    constructor(public state: SettingsState) {}
}
