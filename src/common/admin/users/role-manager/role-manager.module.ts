import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RoleManagerComponent} from './role-manager.component';
import {TranslationsModule} from '../../../core/translations/translations.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';


@NgModule({
    declarations: [
        RoleManagerComponent,
    ],
    imports: [
        CommonModule,
        TranslationsModule,

        // material
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
    ],
    exports: [
        RoleManagerComponent,
    ]
})
export class RoleManagerModule {
}
