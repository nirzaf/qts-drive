import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TagsManagerComponent} from './tags-manager.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {SelectTagsModalComponent} from './select-tags-modal/select-tags-modal.component';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
    declarations: [
        TagsManagerComponent,
        SelectTagsModalComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslationsModule,

        // material
        MatChipsModule,
        MatIconModule,
        MatButtonModule,
        MatAutocompleteModule,
        MatDialogModule,
    ],
    exports: [
        TagsManagerComponent,
        SelectTagsModalComponent,
    ]
})
export class TagsManagerModule {
}
