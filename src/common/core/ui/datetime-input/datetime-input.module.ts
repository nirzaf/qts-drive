import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DatetimeInputComponent} from './datetime-input.component';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslationsModule} from '@common/core/translations/translations.module';

@NgModule({
    declarations: [DatetimeInputComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslationsModule,
    ],
    exports: [
        DatetimeInputComponent,
    ]
})
export class DatetimeInputModule {
}
