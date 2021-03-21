import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BetweenInputComponent} from './between-input/between-input.component';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [BetweenInputComponent],
    imports: [
        CommonModule,
        TranslationsModule,
        ReactiveFormsModule,
    ],
    exports: [BetweenInputComponent]
})
export class BetweenDateInputModule {
}
