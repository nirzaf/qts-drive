import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageZoomComponent} from './image-zoom.component';
import {ImageZoomOverlayComponent} from './image-zoom-overlay/image-zoom-overlay.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
    declarations: [ImageZoomComponent, ImageZoomOverlayComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
    ],
    exports: [
        ImageZoomComponent,
    ]
})
export class ImageZoomModule {
}
