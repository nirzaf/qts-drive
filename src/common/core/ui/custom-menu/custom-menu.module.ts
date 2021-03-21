import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomMenuComponent} from '@common/core/ui/custom-menu/custom-menu.component';
import {RouterModule} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import {TranslationsModule} from '@common/core/translations/translations.module';


@NgModule({
    declarations: [
        CustomMenuComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        MatIconModule,
        TranslationsModule,
    ],
    exports: [
        CustomMenuComponent,
    ]
})
export class CustomMenuModule {
}
