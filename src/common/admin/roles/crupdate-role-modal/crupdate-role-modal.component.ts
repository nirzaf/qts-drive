import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Role} from '@common/core/types/models/Role';
import {Toast} from '@common/core/ui/toast.service';
import {RoleService} from '@common/admin/roles/role.service';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {FormBuilder} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';
import {Settings} from '../../../core/config/settings.service';

export interface CrupdateRoleModalData {
    role: Role;
}

@Component({
    selector: 'crupdate-role-modal',
    templateUrl: './crupdate-role-modal.component.html',
    styleUrls: ['./crupdate-role-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrupdateRoleModalComponent implements OnInit {
    public form = this.fb.group({
        name: [''],
        description: [''],
        type: ['sitewide'],
        default: [false],
        guests: [false],
        permissions: [],
    });
    public loading$ = new BehaviorSubject<boolean>(false);
    public errors$ = new BehaviorSubject<Partial<Role>>({});

    constructor(
        private toast: Toast,
        private roleService: RoleService,
        private modal: Modal,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CrupdateRoleModalComponent>,
        public settings: Settings,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateRoleModalData,
    ) {}

    ngOnInit() {
        this.resetState();
        if (this.data.role) {
           this.form.patchValue(this.data.role);
        }
    }

    public close(data?: Role) {
        this.resetState();
        this.dialogRef.close(data);
    }

    public confirm() {
        this.loading$.next(true);
        let request;
        if (this.data.role) {
            request = this.roleService.update(this.data.role.id, this.form.value);
        } else {
            request = this.roleService.createNew(this.form.value);
        }

        request
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.toast.open('Role ' + (this.data.role ? 'Updated' : 'Created'));
                this.close(response.data);
            }, (errResponse: BackendErrorResponse) => this.errors$.next(errResponse.errors));
    }

    private resetState() {
        this.form.reset();
        this.errors$.next({});
    }
}
