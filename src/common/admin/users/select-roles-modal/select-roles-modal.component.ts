import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Role} from '@common/core/types/models/Role';
import {RoleService} from '@common/admin/roles/role.service';
import {SelectionModel} from '@common/core/utils/SelectionModel';
import {BehaviorSubject} from 'rxjs';

export interface SelectRolesModalData {
    initialRoles?: Role[];
}

@Component({
    selector: 'select-roles-modal',
    templateUrl: './select-roles-modal.component.html',
    styleUrls: ['./select-roles-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectRolesModalComponent implements OnInit {
    public allRoles$ = new BehaviorSubject<Role[]>([]);
    public selectionModel = new SelectionModel(this.data.initialRoles || [], 'id');

    constructor(
        private rolesService: RoleService,
        private dialogRef: MatDialogRef<SelectRolesModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SelectRolesModalData,
    ) {}

    public ngOnInit() {
        this.fetchAllRoles();
    }

    public confirm() {
        this.close(this.selectionModel.values());
    }

    public close(data?) {
        this.dialogRef.close(data);
    }

    private fetchAllRoles() {
        this.rolesService.getRoles()
            .subscribe(response => this.allRoles$.next(response.pagination.data));
    }
}
