import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Settings} from '../../../core/config/settings.service';

@Component({
    selector: 'not-found-page',
    templateUrl: './not-found-page.component.html',
    styleUrls: ['./not-found-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent  {
    constructor(public config: Settings) {}
}
