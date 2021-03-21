import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'contact-widget',
    templateUrl: './contact-widget.component.html',
    styleUrls: ['./contact-widget.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactWidgetComponent {}
