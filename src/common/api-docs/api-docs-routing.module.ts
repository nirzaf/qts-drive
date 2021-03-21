import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ApiDocsComponent } from './api-docs.component';

const apiDocsRoutes: Routes = [
    {
        path: '',
        component: ApiDocsComponent,
    },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(apiDocsRoutes)
    ],
    exports: [
        RouterModule
    ],
})
export class ApiDocsRoutingModule {}
