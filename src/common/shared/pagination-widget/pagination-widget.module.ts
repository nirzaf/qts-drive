import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaginationWidgetComponent} from '@common/shared/pagination-widget/pagination-widget.component';
import { MatButtonModule } from '@angular/material/button';
import {TranslationsModule} from '@common/core/translations/translations.module';


@NgModule({
    declarations: [
        PaginationWidgetComponent,
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        TranslationsModule,
    ],
    exports: [
        PaginationWidgetComponent,
    ]
})
export class PaginationWidgetModule {
}
