import {ChangeDetectionStrategy, Component, ElementRef, Inject, TemplateRef} from '@angular/core';
import {OVERLAY_PANEL_DATA} from '../../core/ui/overlay-panel/overlay-panel-data';
import {OverlayPanelRef} from '../../core/ui/overlay-panel/overlay-panel-ref';
import {matDialogAnimations} from '@angular/material/dialog';

@Component({
    selector: 'datatable-filters-panel',
    templateUrl: './datatable-filters-panel.component.html',
    styleUrls: ['./datatable-filters-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[@dialogContainer]': `'enter'`
    },
    animations: [
        matDialogAnimations.dialogContainer,
    ]
})
export class DatatableFiltersPanelComponent {

    constructor(
        @Inject(OVERLAY_PANEL_DATA) public data: {filters: TemplateRef<ElementRef>},
        private overlayPanelRef: OverlayPanelRef,
    ) {}

    public close() {
        this.overlayPanelRef.close();
    }
}
