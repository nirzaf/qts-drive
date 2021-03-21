import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FindUserModalComponent} from './find-user-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {MatIconModule} from '@angular/material/icon';
import {LoadingIndicatorModule} from '@common/core/ui/loading-indicator/loading-indicator.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        FindUserModalComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslationsModule,
        LoadingIndicatorModule,

        // material
        MatIconModule,
        MatDialogModule,
    ]
})
export class FindUserModalModule {
}
