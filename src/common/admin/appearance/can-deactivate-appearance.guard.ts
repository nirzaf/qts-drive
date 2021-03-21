import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';
import {AppearanceComponent} from './appearance.component';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';
import {AppearanceEditor} from '@common/admin/appearance/appearance-editor/appearance-editor.service';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CanDeactivateAppearance implements CanDeactivate<AppearanceComponent> {
    constructor(
        private editor: AppearanceEditor,
        private modal: Modal,
    ) {}

    canDeactivate(): Observable<boolean>|boolean {
        if ( ! this.editor.changes$.value) return true;

        return this.modal.show(ConfirmModalComponent, {
            title: 'Close Appearance Editor',
            body: 'Are you sure you want to close appearance editor?',
            bodyBold: 'All unsaved changes will be lost.',
            ok: 'Close',
            cancel: 'Stay',
        }).afterClosed();
    }
}
