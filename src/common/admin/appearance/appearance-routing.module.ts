import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AppearanceComponent} from './appearance.component';
import {CanDeactivateAppearance} from './can-deactivate-appearance.guard';
import {AuthGuard} from '../../guards/auth-guard.service';
import {AppearanceEditorResolver} from './appearance-editor/appearance-editor-resolver.service';

const routes: Routes = [
    {
        path: '',
        component: AppearanceComponent,
        data: {permissions: ['appearance.update']},
        resolve: {defaultSettings: AppearanceEditorResolver},
        canActivate: [AuthGuard],
        canDeactivate: [CanDeactivateAppearance],
        children: [
            {path: ''},
            {path: ':panel'},
            {path: ':panel/:activeItem'},
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppearanceRoutingModule {}
