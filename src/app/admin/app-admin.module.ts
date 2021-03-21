import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import { BaseAdminModule } from '@common/admin/base-admin.module';
import { DriveSettingsComponent } from './settings/drive-settings/drive-settings.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ConfirmModalModule } from '@common/core/ui/confirm-modal/confirm-modal.module';
import { ChipsModule } from '../../common/core/ui/chips/chips.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BaseAdminModule,
        ConfirmModalModule,
        ChipsModule,

        // material
        MatProgressBarModule,
    ],
    declarations: [
        DriveSettingsComponent,
    ],
})
export class AppAdminModule {
}
