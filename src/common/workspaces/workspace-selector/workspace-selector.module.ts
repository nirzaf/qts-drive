import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceSelectorComponent } from './workspace-selector.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TranslationsModule } from '../../core/translations/translations.module';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
      WorkspaceSelectorComponent,
  ],
  imports: [
      CommonModule,
      TranslationsModule,

      // material
      MatMenuModule,
      MatButtonModule,
      MatIconModule,
  ],
  exports: [
      WorkspaceSelectorComponent,
  ]
})
export class WorkspaceSelectorModule { }
