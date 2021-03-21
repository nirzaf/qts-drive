import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableSortHeaderComponent} from './table-sort-header/table-sort-header.component';
import {MatIconModule} from '@angular/material/icon';
import {TranslationsModule} from '../core/translations/translations.module';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {UserColumnComponent} from './columns/user-column/user-column.component';
import {TableBodyCheckboxComponent} from './selection/table-body-checkbox.component';
import {TableHeaderCheckboxComponent} from './selection/table-header-checkbox.component';
import {DatatableFooterComponent} from './datatable-footer/datatable-footer.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {DatatableHeaderComponent} from './datatable-header/datatable-header.component';
import {MatChipsModule} from '@angular/material/chips';
import {DatatableFiltersPanelComponent} from './datatable-filters-panel/datatable-filters-panel.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {ChipsModule} from '../core/ui/chips/chips.module';
import { DatatableHeaderSearchInputComponent } from './datatable-header/datatable-header-search-input/datatable-header-search-input.component';
import {NoResultsMessageModule} from '../core/ui/no-results-message/no-results-message.module';
import {NoResultsMessageComponent} from '../core/ui/no-results-message/no-results-message.component';

@NgModule({
    declarations: [
        TableSortHeaderComponent,
        UserColumnComponent,
        TableBodyCheckboxComponent,
        TableHeaderCheckboxComponent,
        DatatableFooterComponent,
        DatatableHeaderComponent,
        DatatableHeaderSearchInputComponent,
        DatatableFiltersPanelComponent,
        DatatableHeaderSearchInputComponent,
    ],
    imports: [
        CommonModule,
        TranslationsModule,
        ReactiveFormsModule,
        FormsModule,
        ChipsModule,
        NoResultsMessageModule,

        // material
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatChipsModule,
        MatProgressBarModule,
    ],
    exports: [
        TableSortHeaderComponent,
        MatCheckboxModule,
        UserColumnComponent,
        TableBodyCheckboxComponent,
        TableHeaderCheckboxComponent,
        DatatableFooterComponent,
        DatatableHeaderComponent,
        DatatableFiltersPanelComponent,
        DatatableHeaderSearchInputComponent,
        NoResultsMessageComponent,
    ]
})
export class DatatableModule {
}
