import {ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {OverlayPanelRef} from '../overlay-panel/overlay-panel-ref';
import {OVERLAY_PANEL_DATA} from '../overlay-panel/overlay-panel-data';
import {ColorPickerService} from 'ngx-color-picker';

@Component({
    templateUrl: './colorpicker-panel.component.html',
    styleUrls: ['./colorpicker-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        ColorPickerService,
    ]
})
export class ColorpickerPanelComponent implements OnInit {
    @ViewChild('trigger', { static: true }) trigger: ElementRef<HTMLElement>;
   public color: string;

    constructor(
        @Inject(OVERLAY_PANEL_DATA) @Optional() public data: {color?: string},
        private overlayPanelRef: OverlayPanelRef,
    ) {}

    ngOnInit() {
        this.color = this.getInitialColor();

        // open color picker
        setTimeout(() => {
            this.trigger.nativeElement.click();
        });
    }

    public emitSelectedEvent(value: string) {
        this.color = value;
        // const rgba = 'rgba(' + hexToRgb(value).join(',') + ')';
        this.overlayPanelRef.emitValue(value);
    }

    private getInitialColor() {
        let color = (this.data && this.data.color) || null;
        if (color && color.replace(/ /g, '') === 'rgba(0,0,0,0)') color = undefined;
        return color;
    }
}
