import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChartsModule} from '@common/shared/charts/charts.module';
import {AnalyticsHostComponent} from '@common/admin/analytics/components/analytics-host/analytics-host.component';
import {DefaultAnalyticsComponent} from '@common/admin/analytics/components/default-analytics/default-analytics.component';
import {AnalyticsHeaderComponent} from '@common/admin/analytics/components/analytics-header/analytics-header.component';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {AnalyticsRoutingRoutingModule} from './analytics-routing.module';
import {MatIconModule} from '@angular/material/icon';
import {FormatPipesModule} from '@common/core/ui/format-pipes/format-pipes.module';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
    imports: [
        AnalyticsRoutingRoutingModule,
        CommonModule,
        ChartsModule,
        TranslationsModule,
        FormatPipesModule,

        // material
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
    ],
    declarations: [
        AnalyticsHostComponent,
        AnalyticsHeaderComponent,
        DefaultAnalyticsComponent,
    ]
})
export class AnalyticsModule {
}
