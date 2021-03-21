import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SvgImageComponent} from './svg-image.component';


@NgModule({
    declarations: [
        SvgImageComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        SvgImageComponent,
    ]
})
export class SvgImageModule {
}
