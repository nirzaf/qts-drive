import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageOrIconComponent} from '@common/core/ui/image-or-icon/image-or-icon.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
    declarations: [
        ImageOrIconComponent,
    ],
    imports: [
        CommonModule,
        MatIconModule,
    ],
    exports: [
        ImageOrIconComponent
    ]
})
export class ImageOrIconModule {
}
