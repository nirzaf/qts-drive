import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ColorPickerInputComponent} from '@common/core/ui/color-picker/color-picker-input/color-picker-input.component';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
    declarations: [
        ColorPickerInputComponent,
    ],
    imports: [
        CommonModule,
        TranslationsModule,
        MatIconModule,
    ],
    exports: [
        ColorPickerInputComponent,
    ]
})
export class ColorPickerInputModule {
}
