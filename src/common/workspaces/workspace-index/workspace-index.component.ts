import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import {CurrentUser} from '@common/auth/current-user';
import {Toast} from '@common/core/ui/toast.service';
import {Router} from '@angular/router';
import {HttpErrors} from '@common/core/http/errors/http-errors.enum';
import {WorkspacesService} from '../workspaces.service';
import {Workspace} from '../types/workspace';
import {CrupdateWorkspaceModalComponent} from '../crupdate-workspace-modal/crupdate-workspace-modal.component';
import {DatatableService} from '@common/datatable/datatable.service';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';
import {ManageWorkspaceMembersModalComponent} from '../manage-workspace-members-modal/manage-workspace-members-modal.component';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {Observable} from 'rxjs';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';
import {LEAVE_WORKSPACE_CONFIRMATION} from '../leave-workspace-confirmation';
import { WORKSPACE_CONFIG, WorkspaceConfig } from '../workspace-config';

@Component({
    selector: 'workspace-index',
    templateUrl: './workspace-index.component.html',
    styleUrls: ['./workspace-index.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DatatableService],
})
export class WorkspaceIndexComponent implements OnInit {
    public workspaces$ = this.datatable.data$ as Observable<Workspace[]>;
    constructor(
        public datatable: DatatableService<Workspace>,
        public currentUser: CurrentUser,
        private workspaces: WorkspacesService,
        private toast: Toast,
        private router: Router,
        private modal: Modal,
        @Inject(WORKSPACE_CONFIG) public workspaceConfig: WorkspaceConfig,
    ) {}

    ngOnInit() {
        this.datatable.init({
            uri: WorkspacesService.BASE_URI,
            staticParams: {
                userId: this.currentUser.get('id'),
            }
        });
    }

    public maybeDeleteWorkspace(workspace: Workspace) {
        this.datatable.confirmResourceDeletion('workspace')
            .subscribe(() => {
                this.workspaces.delete([workspace.id]).subscribe(() => {
                    this.datatable.reset();
                    this.toast.open('Workspace deleted.');
                }, (errResponse: BackendErrorResponse) => {
                    this.toast.open(errResponse.message || HttpErrors.Default);
                });
            });
    }

    public showCrupdateWorkspaceModal(workspace?: Workspace) {
        this.datatable.openCrupdateResourceModal(CrupdateWorkspaceModalComponent, {workspace})
            .subscribe();
    }

    public openWorkspaceMembersModal(workspace: Workspace) {
        this.modal.open(ManageWorkspaceMembersModalComponent, {workspace});
    }

    public filterByUser(): boolean {
        return this.router.url.indexOf('admin') === -1;
    }

    public maybeLeaveWorkspace(workspace: Workspace) {
        this.modal.open(ConfirmModalComponent, LEAVE_WORKSPACE_CONFIRMATION)
            .afterClosed()
            .subscribe(confirmed => {
                if (confirmed) {
                    this.workspaces.deleteMember(workspace.id, this.currentUser.get('id'))
                        .subscribe(() => this.datatable.reset());
                }
            });
    }
}
