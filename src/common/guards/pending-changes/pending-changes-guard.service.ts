import { CanDeactivate } from '@angular/router';
import {ComponentCanDeactivate} from '@common/guards/pending-changes/component-can-deactivate';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';

@Injectable({
    providedIn: 'root',
})
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
    constructor(private modal: Modal) {}

    canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
        if (component.canDeactivate()) {
            return true;
        } else {
            return this.modal.show(ConfirmModalComponent, {
                title: 'Unsaved Changes',
                body:  'You have unsaved changes. Do you want to discard them?',
                ok:    'Discard'
            }).beforeClosed();
        }
    }
}
