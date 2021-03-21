import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SettingsState} from '../../../settings-state.service';

@Component({
    selector: 's3-form',
    templateUrl: './s3-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class S3FormComponent {
    constructor(public state: SettingsState) {}
}
