import {NgModule} from '@angular/core';
import {ColorpickerPanelComponent} from './colorpicker-panel.component';
import {ColorPickerModule} from 'ngx-color-picker';
import {OverlayModule} from '@angular/cdk/overlay';
import {MatIconModule} from '@angular/material/icon';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {CommonModule} from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        ColorPickerModule,
        OverlayModule,
        TranslationsModule,

        // material
        MatIconModule,
    ],
    declarations: [
        ColorpickerPanelComponent,
    ],
    exports: [
        ColorpickerPanelComponent,
    ],
})
export class BeColorPickerModule {
    static components = {
        panel: ColorpickerPanelComponent,
    };
}
