import {ChangeDetectionStrategy, Component, HostBinding, Input} from '@angular/core';
import {Settings} from '../../config/settings.service';

@Component({
    selector: 'no-results-message',
    templateUrl: './no-results-message.component.html',
    styleUrls: ['./no-results-message.component.scss'],
    host: {class: 'no-results-message'},
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoResultsMessageComponent {
    @Input() svgImage = 'no-results.svg';
    @Input() svgIcon: string;
    @Input() @HostBinding('class.horizontal') horizontal = false;
    constructor(public settings: Settings) {}
}
