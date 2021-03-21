import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomDomainIndexComponent} from '@common/custom-domain/custom-domain-index/custom-domain-index.component';
import {CrupdateCustomDomainModalComponent} from '@common/custom-domain/crupdate-custom-domain-modal/crupdate-custom-domain-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NoResultsMessageModule} from '@common/core/ui/no-results-message/no-results-message.module';
import {FormatPipesModule} from '@common/core/ui/format-pipes/format-pipes.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DatatableModule} from '../datatable/datatable.module';
import {CustomDomainTableComponent} from './custom-domain-index/custom-domain-table/custom-domain-table.component';
import {LoadingIndicatorModule} from '../core/ui/loading-indicator/loading-indicator.module';

@NgModule({
    declarations: [
        CustomDomainIndexComponent,
        CrupdateCustomDomainModalComponent,
        CustomDomainTableComponent,
    ],
    imports: [
        CommonModule,
        TranslationsModule,
        NoResultsMessageModule,
        FormatPipesModule,
        FormsModule,
        ReactiveFormsModule,
        DatatableModule,
        LoadingIndicatorModule,

        // material
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatDialogModule,
        MatSlideToggleModule,
    ],
    exports: [
        CrupdateCustomDomainModalComponent,
        CustomDomainTableComponent,
    ]
})
export class CustomDomainModule {}
