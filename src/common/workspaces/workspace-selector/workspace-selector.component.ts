import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Workspace } from '../types/workspace';
import { MatMenuTrigger } from '@angular/material/menu';
import { WorkspacesService } from '../workspaces.service';
import { Modal } from '../../core/ui/dialogs/modal.service';
import { CurrentUser } from '../../auth/current-user';
import { BackendErrorResponse } from '../../core/types/backend-error-response';
import { HttpErrors } from '../../core/http/errors/http-errors.enum';
import { ConfirmModalComponent } from '../../core/ui/confirm-modal/confirm-modal.component';
import { filter } from 'rxjs/operators';
import { DELETE_RESOURCE_MESSAGE } from '../../datatable/delete-resource-message';
import { Toast } from '../../core/ui/toast.service';

@Component({
    selector: 'workspace-selector',
    templateUrl: './workspace-selector.component.html',
    styleUrls: ['./workspace-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceSelectorComponent implements OnInit {
    @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;

    constructor(
        private modal: Modal,
        public workspaces: WorkspacesService,
        public currentUser: CurrentUser,
        private toast: Toast,
        private vcr: ViewContainerRef,
        private cd: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.workspaces.index({userId: this.currentUser.get('id'), withCount: ['members']})
            .subscribe();
    }

    public openCrupdateWorkspaceModal(workspace?: Workspace) {
        import('src/common/workspaces/workspace.module')
            .then(m => {
                // will have wrong WorkspacesService instance without passing viewContainerRef
                this.modal.open(m.WorkspaceModule.components.crupdateModal, {workspace}, {viewContainerRef: this.vcr});
                this.cd.markForCheck();
            });
    }

    public openWorkspaceMembersModal(workspace: Workspace) {
        import('src/common/workspaces/workspace.module')
            .then(m => {
                this.modal.open(m.WorkspaceModule.components.manageMembers, {workspace}, {viewContainerRef: this.vcr});
                this.cd.markForCheck();
                this.menuTrigger.closeMenu();
            });

    }

    public maybeDeleteWorkspace(workspace: Workspace) {
        const data = {...DELETE_RESOURCE_MESSAGE, replacements: {resource: 'workspace'}};
        this.modal.open(ConfirmModalComponent, data)
            .afterClosed()
            .pipe(filter(confirmed => confirmed))
            .subscribe(() => {
                this.workspaces.delete([workspace.id]).subscribe(() => {
                    this.toast.open('Workspace deleted.');
                }, (errResponse: BackendErrorResponse) => {
                    this.toast.open(errResponse.message || HttpErrors.Default);
                });
            });
    }

    public selectWorkspace(workspace: Workspace) {
        this.workspaces.select(workspace.id);
        this.menuTrigger.closeMenu();
    }
}
