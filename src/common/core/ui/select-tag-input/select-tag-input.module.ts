import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {ReactiveFormsModule} from '@angular/forms';
import {LoadingIndicatorModule} from '@common/core/ui/loading-indicator/loading-indicator.module';
import {SelectTagInputComponent} from '@common/core/ui/select-tag-input/select-tag-input/select-tag-input.component';

@NgModule({
    declarations: [SelectTagInputComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatMenuModule,
        TranslationsModule,
        ReactiveFormsModule,
        MatIconModule,
        LoadingIndicatorModule,
    ],
    exports: [
        SelectTagInputComponent
    ]
})
export class SelectTagInputModule {
}
