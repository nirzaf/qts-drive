import {ChangeDetectionStrategy, Component, Inject, Optional, ViewEncapsulation} from '@angular/core';
import {OVERLAY_PANEL_DATA} from '@common/core/ui/overlay-panel/overlay-panel-data';
import {OverlayPanelRef} from '@common/core/ui/overlay-panel/overlay-panel-ref';
import { matDialogAnimations } from '@angular/material/dialog';

@Component({
    selector: 'image-zoom-overlay',
    templateUrl: './image-zoom-overlay.component.html',
    styleUrls: ['./image-zoom-overlay.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[@dialogContainer]': `'enter'`
    },
    animations: [
        matDialogAnimations.dialogContainer,
    ]
})
export class ImageZoomOverlayComponent {
    constructor(
        @Inject(OVERLAY_PANEL_DATA) @Optional() public data: {src: string, alt?: string},
        private overlayPanelRef: OverlayPanelRef
    ) {}

    public close() {
        this.overlayPanelRef.close();
    }
}
