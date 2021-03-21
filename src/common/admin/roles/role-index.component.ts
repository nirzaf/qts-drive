import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CurrentUser} from '../../auth/current-user';
import {User} from '../../core/types/models/User';
import {Role} from '../../core/types/models/Role';
import {RoleService} from './role.service';
import {Toast} from '../../core/ui/toast.service';
import {Modal} from '../../core/ui/dialogs/modal.service';
import {ConfirmModalComponent} from '../../core/ui/confirm-modal/confirm-modal.component';
import {CrupdateRoleModalComponent} from './crupdate-role-modal/crupdate-role-modal.component';
import {BehaviorSubject, Observable} from 'rxjs';
import {FindUserModalComponent} from '@common/auth/find-user-modal/find-user-modal.component';
import {BreakpointsService} from '@common/core/ui/breakpoints.service';
import {Users} from '../../auth/users.service';
import {DatatableService} from '../../datatable/datatable.service';

@Component({
    selector: 'role-index',
    templateUrl: './role-index.component.html',
    styleUrls: ['./role-index.component.scss'],
    providers: [DatatableService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleIndexComponent implements OnInit {
    public roles$ = new BehaviorSubject<Role[]>([]);
    public users$ = this.datatable.data$ as Observable<User[]>;
    public selectedRole$ = new BehaviorSubject<Role>(new Role());

    constructor(
        private roleApi: RoleService,
        private toast: Toast,
        private modal: Modal,
        public currentUser: CurrentUser,
        public breakpoints: BreakpointsService,
        public datatable: DatatableService<User>,
    ) {}

    ngOnInit() {
        this.refreshRoles().then(() => {
            this.datatable.init({
                uri: Users.BASE_URI,
                staticParams: {
                    role_id: this.selectedRole$.value?.id
                }
            });
        });
    }

    public selectRole(role: Role) {
        if (this.selectedRole$.value.id !== role.id) {
            this.selectedRole$.next(role);
            this.refreshRoleUsers(role);
        }
    }

    public refreshRoles() {
        return new Promise(resolve => {
            this.roleApi.getRoles().subscribe(response => {
                this.roles$.next(response.pagination.data);
                if (this.roles$.value.length) {
                    // if no role is currently selected, select first
                    if ( ! this.selectedRole$.value.id) {
                        this.selectRole(this.roles$.value[0]);

                    // if role is selected, try to re-select it with the one returned from server
                    } else {
                        const role = this.roles$.value.find(r => r.id === this.selectedRole$.value.id);
                        if (role) {
                            this.selectedRole$.next(role);
                        }
                    }
                }
                resolve();
            });
        });
    }

    public refreshRoleUsers(role: Role) {
        if (role.type === 'sitewide' && !role.guests) {
            this.datatable.reset({role_id: role.id});
        } else {
            this.datatable.reset({role_id: 999});
        }
    }

    public showAssignUsersModal() {
        this.modal.open(FindUserModalComponent)
            .afterClosed()
            .subscribe((user: User) => {
                if (user) {
                    this.roleApi.addUsers(this.selectedRole$.value.id, [user.email]).subscribe(() => {
                        this.toast.open('User assigned to role');
                        this.refreshRoleUsers(this.selectedRole$.value);
                    });
                }
            });
    }

    public showCrupdateRoleModal(role?: Role) {
        this.modal.show(CrupdateRoleModalComponent, {role}).afterClosed().subscribe(data => {
            if ( ! data) return;
            this.refreshRoles();
        });
    }

    public maybeDeleteRole(role: Role) {
        this.modal.open(ConfirmModalComponent, {
            title: 'Delete Role',
            body:  'Are you sure you want to delete this role?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteRole(role);
        });
    }

    public deleteRole(role: Role) {
        this.roleApi.delete(role.id).subscribe(() => {
            this.selectedRole$.next(new Role());
            this.refreshRoles().then(() => {
                this.refreshRoleUsers(this.selectedRole$.value);
            });
        });
    }

    public maybeDetachUsers() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Remove users from role',
            body:  'Are you sure you want to remove selected users from this role?',
            ok:    'Remove'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.removeUsersFromSelectedRole();
        });
    }

    public removeUsersFromSelectedRole() {
        this.roleApi.removeUsers(this.selectedRole$.value.id, this.datatable.selectedRows$.value).subscribe(() => {
            this.refreshRoleUsers(this.selectedRole$.value);
            this.datatable.selectedRows$.next([]);
            this.toast.open('Users removed from role.');
        });
    }

    public canAssignUsers() {
        return this.selectedRole$.value.id && !this.datatable.selectedRows$.value.length && !this.selectedRole$.value.guests;
    }
}
