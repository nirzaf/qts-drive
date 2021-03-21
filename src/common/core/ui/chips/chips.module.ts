import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChipInputComponent} from './chip-input/chip-input.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatRippleModule} from '@angular/material/core';

@NgModule({
    imports: [
        CommonModule,
        MatChipsModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        TranslationsModule,

        MatButtonModule,
        MatIconModule,
        MatRippleModule,
    ],
    declarations: [
        ChipInputComponent,
    ],
    exports: [
        ChipInputComponent,
    ]
})
export class ChipsModule {
}
