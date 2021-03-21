import {OverlayRef} from '@angular/cdk/overlay';

export class ContextMenuRef<T> {
    constructor(private overlayRef: OverlayRef) {}

    public close() {
        if (this.overlayRef) {
            this.overlayRef.dispose();
        }
    }

    public backdropClick() {
        return this.overlayRef.backdropClick();
    }

    public attachments() {
        return this.overlayRef.attachments();
    }

    public detachments() {
        return this.overlayRef.detachments();
    }

    public backdropElement() {
        return this.overlayRef.backdropElement;
    }

    public contextMenuElement() {
        return this.overlayRef.overlayElement;
    }
}
