import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {OverlayPanel} from '@common/core/ui/overlay-panel/overlay-panel.service';
import {ImageZoomOverlayComponent} from '@common/core/ui/image-zoom/image-zoom-overlay/image-zoom-overlay.component';

@Component({
    selector: 'image-zoom',
    templateUrl: './image-zoom.component.html',
    styleUrls: ['./image-zoom.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageZoomComponent {
    @Input() src: string;
    @Input() alt: string;

    constructor(private overlay: OverlayPanel) {}

    public zoomImage() {
        this.overlay.open(ImageZoomOverlayComponent, {
            position: 'center',
            origin: 'global',
            data: {src: this.src, alt: this.alt},
            panelClass: 'image-zoom-overlay-container'
        });
    }
}
