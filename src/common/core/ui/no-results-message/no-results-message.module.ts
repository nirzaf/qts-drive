import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NoResultsMessageComponent} from '@common/core/ui/no-results-message/no-results-message.component';
import {SvgImageModule} from '../svg-image/svg-image.module';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
    declarations: [
        NoResultsMessageComponent,
    ],
    imports: [
        CommonModule,
        SvgImageModule,

        MatIconModule,
    ],
    exports: [
        NoResultsMessageComponent,
    ]
})
export class NoResultsMessageModule {
}
