import { Component, ViewEncapsulation, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
    selector: 'loading-toast',
    templateUrl: './loading-toast.component.html',
    styleUrls: ['./loading-toast.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingToastComponent {
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: {message: string}) {}
}
