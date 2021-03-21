import {NgModule} from '@angular/core';
import {TranslateDirective} from './translate.directive';
import { TransPipe } from './translate.pipe';

@NgModule({
    declarations: [
        TranslateDirective,
        TransPipe,
    ],
    exports: [
        TranslateDirective,
        TransPipe,
    ],
})
export class TranslationsModule {}
