import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomPagesIndexComponent} from './custom-pages-index.component';
import {CrupdateCustomPageComponent} from './crupdate-custom-page/crupdate-custom-page.component';
import {DatatableModule} from '../../datatable/datatable.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TranslationsModule} from '../../core/translations/translations.module';
import {RouterModule} from '@angular/router';
import {FormatPipesModule} from '../../core/ui/format-pipes/format-pipes.module';
import {NoResultsMessageModule} from '../../core/ui/no-results-message/no-results-message.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SlugControlModule} from '../../shared/form-controls/slug-control/slug-control.module';
import {TextEditorModule} from '../../text-editor/text-editor.module';
import {LoadingIndicatorModule} from '../../core/ui/loading-indicator/loading-indicator.module';
import {CustomPageTableComponent} from './custom-page-table/custom-page-table.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@NgModule({
    declarations: [
        CustomPagesIndexComponent,
        CrupdateCustomPageComponent,
        CustomPageTableComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        DatatableModule,
        TranslationsModule,
        FormatPipesModule,
        NoResultsMessageModule,
        TextEditorModule,
        LoadingIndicatorModule,

        FormsModule,
        ReactiveFormsModule,
        SlugControlModule,

        // material
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatSlideToggleModule,
    ],
    exports: [
        CustomPagesIndexComponent,
        CrupdateCustomPageComponent,
        CustomPageTableComponent,
    ]
})
export class CustomPageIndexModule {
}
