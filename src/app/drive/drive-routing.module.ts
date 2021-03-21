import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DriveComponent } from './drive.component';
import { EntriesContainerComponent } from './entries/entries-container/entries-container.component';
import { LinkPreviewContainerComponent } from './preview/link-preview-container/link-preview-container.component';
import { AuthGuard } from '@common/guards/auth-guard.service';
import { CheckPermissionsGuard } from '../../common/guards/check-permissions-guard.service';

const dashboardRoutes: Routes = [
    // shareable links can be accessed by guests
    {
        path: 's/:hash',
        component: LinkPreviewContainerComponent,
    },

    // main drive routes can only be accessed by logged in users
    {
        path: '',
        component: DriveComponent,
        canActivate: [AuthGuard, CheckPermissionsGuard],
        children: [
            { path: '', component: EntriesContainerComponent},
            { path: 'shares', component: EntriesContainerComponent},
            { path: 'search', component: EntriesContainerComponent},
            { path: 'recent', component: EntriesContainerComponent},
            { path: 'starred', component: EntriesContainerComponent},
            { path: 'trash', component: EntriesContainerComponent},
            { path: 'folders/:hash', component: EntriesContainerComponent},
            {
                path: 'workspaces',
                loadChildren: () => import('src/app/drive/workspace-wrapper.module').then(m => m.WorkspaceWrapperModule)
            },
        ]
    },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(dashboardRoutes)
    ],
    exports: [
        RouterModule
    ],
})
export class DriveRoutingModule {}
