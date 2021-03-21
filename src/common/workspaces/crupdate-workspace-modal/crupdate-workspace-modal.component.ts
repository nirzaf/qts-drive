import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Toast } from '@common/core/ui/toast.service';
import { finalize } from 'rxjs/operators';
import { BackendErrorResponse } from '@common/core/types/backend-error-response';
import { Workspace } from '../types/workspace';
import { WorkspacesService } from '../workspaces.service';

export interface CrupdateWorkspaceModalData {
    workspace?: Workspace;
}

@Component({
    selector: 'crupdate-workspace-modal',
    templateUrl: './crupdate-workspace-modal.component.html',
    styleUrls: ['./crupdate-workspace-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrupdateWorkspaceModalComponent {
    public loading$ = new BehaviorSubject(false);
    public errors$ = new BehaviorSubject<{name?: string}>({});
    public form = new FormGroup({
        name: new FormControl(),
    });

    constructor(
        private dialogRef: MatDialogRef<CrupdateWorkspaceModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateWorkspaceModalData,
        private workspaces: WorkspacesService,
        private toast: Toast,
    ) {
        if (data.workspace) {
            this.form.patchValue(data.workspace);
        }
    }

    public confirm() {
        this.loading$.next(true);
        const request = this.data.workspace ?
            this.workspaces.update(this.data.workspace.id, this.form.value) :
            this.workspaces.create(this.form.value);
        request.pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.toast.open(this.data.workspace ? 'Workspace updated.' : 'Workspace created.');
                this.close(response.workspace);
            }, (errResponse: BackendErrorResponse) => this.errors$.next(errResponse.errors));
    }

    public close(workspace?: Workspace) {
        this.dialogRef.close(workspace);
    }
}
