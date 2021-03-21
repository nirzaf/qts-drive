import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TextEditorComponent} from './text-editor.component';
import {MatIconModule} from '@angular/material/icon';
import {TranslationsModule} from '@common/core/translations/translations.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslationsModule,

        // material
        MatButtonModule,
        MatSnackBarModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatDialogModule,
        MatMenuModule,
        MatIconModule,
    ],
    declarations: [
        TextEditorComponent,
    ],
    exports: [
        TextEditorComponent,
    ],
})
export class TextEditorModule { }
