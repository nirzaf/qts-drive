import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SlugControlComponent} from './slug-control.component';
import {ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {TranslationsModule} from '@common/core/translations/translations.module';


@NgModule({
    declarations: [SlugControlComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        TranslationsModule,
        MatIconModule,
    ],
    exports: [
        SlugControlComponent,
    ]
})
export class SlugControlModule {
}
