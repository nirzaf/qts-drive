import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'loading-page',
    styleUrls: ['./loading-page.component.scss'],
    templateUrl: './loading-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingPageComponent {
}
