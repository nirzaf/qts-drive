import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import {RIGHT_POSITION} from '@common/core/ui/overlay-panel/positions/right-position';
import {OverlayPanelRef} from '@common/core/ui/overlay-panel/overlay-panel-ref';
import {OverlayPanel} from '@common/core/ui/overlay-panel/overlay-panel.service';

@Component({
    selector: 'info-popover',
    templateUrl: './info-popover.component.html',
    styleUrls: ['./info-popover.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class InfoPopoverComponent {
    @ViewChild('infoIcon', { read: ElementRef }) infoButton: ElementRef<HTMLElement>;
    @ViewChild('popoverContent') content: TemplateRef<any>;
    private overlayRef: OverlayPanelRef;

    constructor(
        private overlay: OverlayPanel,
        private viewContainerRef: ViewContainerRef,
    ) {}

    public openPopover() {
        if (this.overlayRef) {
            this.closePopover();
        }
        const position = {...RIGHT_POSITION};
        position[0].offsetY = -15;
        this.overlayRef = this.overlay.open(this.content, {
            origin: this.infoButton,
            position: RIGHT_POSITION,
            hasBackdrop: false,
            scrollStrategy: 'close',
            viewContainerRef: this.viewContainerRef,
            panelClass: 'info-popover-panel'
        });

        this.overlayRef.getPanelEl().addEventListener('mouseleave', () => {
            this.closePopover();
        });
    }

    public closePopover() {
        if (this.overlayRef) {
            this.overlayRef.close();
            this.overlayRef = null;
        }
    }

    public togglePopover() {
        if (this.overlayRef) {
            this.closePopover();
        } else {
            this.openPopover();
        }
    }

    public onMouseLeave(e: MouseEvent) {
        const toElement = (e['toElement'] || e.relatedTarget) as HTMLElement;
        if ( !toElement || !toElement.classList.contains('info-popover-panel')) {
            this.closePopover();
        }
    }
}
