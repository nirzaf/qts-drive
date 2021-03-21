import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { OpenFilePreview } from '../actions/commands';
import { OverlayPanel } from '@common/core/ui/overlay-panel/overlay-panel.service';
import { FilePreviewOverlayComponent } from '../../preview/file-preview-overlay/file-preview-overlay.component';
import { DriveState } from '../drive-state';
import { Injectable } from '@angular/core';

@Injectable()
export class OverlayHandler {
    constructor(
        private store: Store,
        private actions$: Actions,
        private overlay: OverlayPanel,
    ) {
        this.actions$.pipe(ofActionSuccessful(OpenFilePreview))
            .subscribe((action: OpenFilePreview) => {
                const entries = this.store.selectSnapshot(DriveState.entries).filter(e => e.type !== 'folder');
                const selectedEntry = this.store.selectSnapshot(DriveState.selectedEntry);
                const activeEntry = entries.findIndex(e => e.id === selectedEntry?.id);
                this.overlay.open(FilePreviewOverlayComponent, {
                    position: 'center',
                    origin: 'global',
                    panelClass: 'file-preview-overlay-container',
                    data: {entries: entries.slice(), activeEntry: activeEntry === -1 ? 0 : activeEntry},
                });
            });
    }
}
