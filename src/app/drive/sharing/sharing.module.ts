import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharingPermissionsButtonComponent } from './sharing-permissions-button/sharing-permissions-button.component';
import { ShareDialogComponent } from './share-dialog/share-dialog.component';
import { EntriesAccessTableComponent } from './entries-access-table/entries-access-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { LinkOptionsComponent } from './links/link-options/link-options.component';
import { ShareLinkDialogComponent } from './share-link-dialog/share-link-dialog.component';
import { NoSharedEntriesComponent } from './no-shared-entries/no-shared-entries.component';
import { TranslationsModule } from '@common/core/translations/translations.module';
import { LoadingIndicatorModule } from '@common/core/ui/loading-indicator/loading-indicator.module';
import { Modal } from '@common/core/ui/dialogs/modal.service';
import { ChipsModule } from '@common/core/ui/chips/chips.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslationsModule,
        LoadingIndicatorModule,

        // material
        MatSlideToggleModule,
        MatTabsModule,
        MatDialogModule,
        ChipsModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatTooltipModule,
        MatCheckboxModule,
    ],
    declarations: [
        ShareDialogComponent,
        EntriesAccessTableComponent,
        SharingPermissionsButtonComponent,
        LinkOptionsComponent,
        ShareLinkDialogComponent,
        NoSharedEntriesComponent,
    ],
    exports: [
        NoSharedEntriesComponent,
    ],
    providers: [
        Modal,
    ]
})
export class SharingModule {
}
