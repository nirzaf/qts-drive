import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InfoPopoverComponent} from '@common/core/ui/info-popover/info-popover.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { DocsInfoPopoverComponent } from './docs-info-popover/docs-info-popover.component';


@NgModule({
    declarations: [
        InfoPopoverComponent,
        DocsInfoPopoverComponent,
    ],
    imports: [
        CommonModule,

        // material
        MatIconModule,
        MatButtonModule,
    ],
    exports: [
        InfoPopoverComponent,
        DocsInfoPopoverComponent,
    ]
})
export class InfoPopoverModule {
}
