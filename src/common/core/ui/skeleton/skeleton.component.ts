import {ChangeDetectionStrategy, Component, HostBinding, Input} from '@angular/core';
import {ThemeService} from '../../theme.service';

@Component({
    selector: 'skeleton',
    templateUrl: './skeleton.component.html',
    styleUrls: ['./skeleton.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'aria-busy': 'true',
        'aria-valuemin': '0',
        'aria-valuemax': '100',
        'aria-valuetext': 'Loading...',
        'role': 'progressbar',
    }
})
export class SkeletonComponent {
    @Input() animation: 'pulsate' | 'wave' = 'wave';
    @Input() variant: 'avatar' | 'text' | 'rect' = 'text';
    @HostBinding('class.dark') dark = this.theme.isDarkMode();

    @HostBinding('class.pulsate') get pulsate() {
        return this.animation === 'pulsate';
    }

    @HostBinding('class.wave') get wave() {
        return this.animation === 'wave';
    }

    @HostBinding('class.avatar') get avatar() {
        return this.variant === 'avatar';
    }

    @HostBinding('class.text') get text() {
        return this.variant === 'text';
    }

    @HostBinding('class.rect') get rect() {
        return this.variant === 'rect';
    }

    constructor(private theme: ThemeService) {}
}
