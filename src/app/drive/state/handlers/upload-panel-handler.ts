import { Actions, ofActionSuccessful } from '@ngxs/store';
import { CloseUploadsPanel, OpenUploadsPanel } from '../actions/commands';
import { OverlayPanel } from '@common/core/ui/overlay-panel/overlay-panel.service';
import { UploadsPanelComponent } from '../../uploads/uploads-panel/uploads-panel.component';
import { OverlayPanelRef } from '@common/core/ui/overlay-panel/overlay-panel-ref';
import { CurrentUser } from '@common/auth/current-user';
import { OverlayPanelConfig } from '@common/core/ui/overlay-panel/overlay-panel-config';
import { Injectable } from '@angular/core';

const overlayConfig: OverlayPanelConfig = {
    origin: 'global',
    hasBackdrop: false,
    position: {right: '10px', bottom: '10px'},
    mobilePosition: {left: 0, bottom: 0}
};

@Injectable()
export class UploadPanelHandler {
    private uploadPanelRef: OverlayPanelRef<UploadsPanelComponent>;

    constructor(
        private actions$: Actions,
        private currentUser: CurrentUser,
        private overlayPanel: OverlayPanel,
    ) {
        this.actions$
            .pipe(ofActionSuccessful(OpenUploadsPanel))
            .subscribe(() => {
                this.openUploadsPanel();
            });

        this.actions$
            .pipe(ofActionSuccessful(CloseUploadsPanel))
            .subscribe(() => {
               this.closeUploadsPanel();
            });

        this.currentUser.model$.subscribe(() => {
            this.closeUploadsPanel();
        });
    }

    public openUploadsPanel() {
        if (this.uploadPanelRef) return;
        this.uploadPanelRef = this.overlayPanel
            .open(UploadsPanelComponent, overlayConfig);
    }

    private closeUploadsPanel() {
        if ( ! this.uploadPanelRef) return;
        this.uploadPanelRef.close();
        this.uploadPanelRef = null;
    }
}
