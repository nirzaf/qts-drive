import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceModule } from '../../common/workspaces/workspace.module';
import { RouterModule } from '@angular/router';
import { WorkspaceIndexComponent } from '../../common/workspaces/workspace-index/workspace-index.component';

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: WorkspaceIndexComponent}
    ])],
    exports: [RouterModule]
})
class RoutingModule { }

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        WorkspaceModule,
        RoutingModule
  ]
})
export class WorkspaceWrapperModule { }
