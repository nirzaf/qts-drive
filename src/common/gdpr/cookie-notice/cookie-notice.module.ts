import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CookieNoticeComponent} from '@common/gdpr/cookie-notice/cookie-notice.component';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {MatButtonModule} from '@angular/material/button';
import {RouterModule} from '@angular/router';

@NgModule({
    declarations: [
        CookieNoticeComponent,
    ],
    imports: [
        CommonModule,
        TranslationsModule,
        RouterModule,

        // material
        MatButtonModule,
    ],
    exports: [
        CookieNoticeComponent,
    ]
})
export class CookieNoticeModule {
}
