import {ChangeDetectionStrategy, Component, HostBinding, Input} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'loading-indicator',
    styleUrls: ['./loading-indicator.component.scss'],
    templateUrl: './loading-indicator.component.html',
    animations: [
        trigger('visibility', [
            state('true', style({
                opacity: '1',
                display: 'block',
            })),
            state('false', style({
                opacity: '0',
                display: 'none'
            })),
            transition('true <=> false', animate('125ms cubic-bezier(.4,0,.2,1)'))
        ]),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingIndicatorComponent {
    @HostBinding('@visibility') @Input() isVisible = false;

    public show() {
        this.isVisible = true;
    }

    public hide() {
        this.isVisible = false;
    }

    public toggle() {
        this.isVisible = !this.isVisible;
    }
}
