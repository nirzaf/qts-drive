import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContextMenuDirective} from '@common/core/ui/context-menu/context-menu.directive';


@NgModule({
    declarations: [
        ContextMenuDirective,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ContextMenuDirective,
    ]
})
export class ContextMenuModule {
}
