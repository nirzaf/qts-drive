import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrupdateWorkspaceModalComponent } from './crupdate-workspace-modal/crupdate-workspace-modal.component';
import { ManageWorkspaceMembersModalComponent } from './manage-workspace-members-modal/manage-workspace-members-modal.component';
import { WorkspaceIndexComponent } from './workspace-index/workspace-index.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslationsModule } from '../core/translations/translations.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { DatatableModule } from '../datatable/datatable.module';
import { InfoPopoverModule } from '../core/ui/info-popover/info-popover.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormatPipesModule } from '../core/ui/format-pipes/format-pipes.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SkeletonModule } from '../core/ui/skeleton/skeleton.module';
import { ChipsModule } from '../core/ui/chips/chips.module';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
      CrupdateWorkspaceModalComponent,
      ManageWorkspaceMembersModalComponent,
      WorkspaceIndexComponent,
  ],
  imports: [
    CommonModule,
      FormsModule,
      ReactiveFormsModule,
      TranslationsModule,
      DatatableModule,
      InfoPopoverModule,
      FormatPipesModule,
      SkeletonModule,
      ChipsModule,

      // material
      MatIconModule,
      MatButtonModule,
      MatDialogModule,
      MatRadioModule,
      MatTooltipModule,
      MatProgressBarModule,
      MatMenuModule,
  ],
  exports: [
    CrupdateWorkspaceModalComponent,
    ManageWorkspaceMembersModalComponent,
    WorkspaceIndexComponent,
  ]
})
export class WorkspaceModule {
  static components = {
    crupdateModal: CrupdateWorkspaceModalComponent,
    manageMembers: ManageWorkspaceMembersModalComponent,
  };
}
