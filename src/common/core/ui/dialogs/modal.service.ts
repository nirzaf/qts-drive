import {Injectable} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {ComponentType} from '@angular/cdk/portal';

@Injectable({
    providedIn: 'root',
})
export class Modal {
    constructor(private dialog: MatDialog) {}

    public open<T>(component: ComponentType<T>, data: object = {}, config: MatDialogConfig = {}): MatDialogRef<T> {
        if ( ! data) data = {};

        if ( ! Array.isArray(config.panelClass)) {
            config.panelClass = [config.panelClass];
        }
        if (typeof config.restoreFocus === 'undefined') {
            config.restoreFocus = false;
        }
        config.panelClass.push('be-modal');

        return this.dialog.open(component, {...config, data});
    }

    public show<T>(component: ComponentType<T>, data: object = {}): MatDialogRef<T> {
        return this.open(component, data);
    }

    public anyDialogOpen(): boolean {
        return this.dialog.openDialogs.length > 0;
    }

    public closeAll() {
        this.dialog.closeAll();
    }
}
