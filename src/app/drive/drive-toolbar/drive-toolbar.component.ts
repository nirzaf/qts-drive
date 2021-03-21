import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'drive-toolbar',
    templateUrl: './drive-toolbar.component.html',
    styleUrls: ['./drive-toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DriveToolbarComponent {
}
