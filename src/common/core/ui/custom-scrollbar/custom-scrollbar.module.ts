import {NgModule} from '@angular/core';
import {CustomScrollbarDirective} from './custom-scrollbar.directive';

@NgModule({
    declarations: [
        CustomScrollbarDirective
    ],
    exports: [
        CustomScrollbarDirective,
    ]
})
export class CustomScrollbarModule {
}
