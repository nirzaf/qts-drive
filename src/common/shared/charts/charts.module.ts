import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChartComponent} from '@common/shared/charts/chart/chart.component';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
    imports: [
        CommonModule,
        TranslationsModule,

        // material
        MatIconModule,
    ],
    declarations: [
        ChartComponent
    ],
    exports: [
        ChartComponent,
    ]
})
export class ChartsModule {
}
