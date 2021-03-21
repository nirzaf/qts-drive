import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectUserInputComponent} from './select-user-input/select-user-input.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {ReactiveFormsModule} from '@angular/forms';
import {LoadingIndicatorModule} from '@common/core/ui/loading-indicator/loading-indicator.module';

@NgModule({
    declarations: [SelectUserInputComponent],
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
        SelectUserInputComponent
    ],
})
export class SelectUserInputModule {
}
