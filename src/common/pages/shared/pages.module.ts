import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {CustomPageComponent} from './custom-page/custom-page.component';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';
import {MaterialNavbarModule} from '../../core/ui/material-navbar/material-navbar.module';
import {MatButtonModule} from '@angular/material/button';
import {TranslationsModule} from '../../core/translations/translations.module';

const routes: Routes = [
    {
        path: 'pages/:id/:slug',
        component: CustomPageComponent,
        data: {permissions: ['custom_pages.view'], willSetSeo: true}
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {
}

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        PagesRoutingModule,
        MaterialNavbarModule,
        TranslationsModule,
        MatButtonModule,
    ],
    declarations: [
        CustomPageComponent,
        NotFoundPageComponent,
    ],
    exports: [
        CustomPageComponent,
        NotFoundPageComponent,
    ]
})
export class PagesModule {
}

