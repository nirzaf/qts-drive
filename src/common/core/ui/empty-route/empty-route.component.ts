import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'empty-route',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyRouteComponent {}
