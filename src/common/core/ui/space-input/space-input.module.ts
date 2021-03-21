import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpaceInputComponent } from './space-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import {TranslationsModule} from '../../translations/translations.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslationsModule,
    ],
    declarations: [
        SpaceInputComponent
    ],
    exports: [
        SpaceInputComponent,
    ]
})
export class SpaceInputModule {
}
