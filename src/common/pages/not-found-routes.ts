import {Routes} from '@angular/router';
import {NotFoundPageComponent} from './shared/not-found-page/not-found-page.component';
import {LoadingPageComponent} from '../core/ui/loading-indicator/loading-page/loading-page.component';

export const NOT_FOUND_ROUTES: Routes = [
    {
        path: 'loading',
        component: LoadingPageComponent,
    },
    {
        path: '**',
        pathMatch: 'full',
        component: NotFoundPageComponent
    },
    {
        path: '404',
        pathMatch: 'full',
        component: NotFoundPageComponent
    },
];
