import {NgModule} from '@angular/core';
import {ConfirmModalComponent} from './confirm-modal.component';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';

@NgModule({
    imports: [
        CommonModule,

        // material
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
    ],
    declarations: [
        ConfirmModalComponent
    ],
    exports: [
        ConfirmModalComponent,
        MatIconModule,
    ],
})
export class ConfirmModalModule {
}
