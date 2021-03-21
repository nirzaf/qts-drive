import { Actions, ofActionDispatched, Store } from '@ngxs/store';
import { OpenConfirmDialog, OpenDialog } from '../actions/commands';
import { Injectable } from '@angular/core';
import { Modal } from '@common/core/ui/dialogs/modal.service';
import { ConfirmModalComponent } from '@common/core/ui/confirm-modal/confirm-modal.component';

@Injectable()
export class DialogHandler {
    constructor(
        private actions$: Actions,
        private dialog: Modal,
        private store: Store,
    ) {
        this.actions$.pipe(ofActionDispatched(OpenDialog))
            .subscribe((action: OpenDialog) => {
                this.dialog.open(action.dialog, action.data, action.config);
            });

        this.actions$.pipe(ofActionDispatched(OpenConfirmDialog))
            .subscribe((action: OpenConfirmDialog) => {
                this.openConfirmDialog(action);
            });
    }

    private openConfirmDialog(action: OpenConfirmDialog) {
        this.dialog.open(ConfirmModalComponent, action.data)
            .beforeClosed()
            .subscribe(confirmed => {
                if ( ! confirmed) return;
                return this.store.dispatch(action.confirmAction);
            });
    }
}
