import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Role} from '@common/core/types/models/Role';
import {Users} from '@common/auth/users.service';
import {RoleService} from '@common/admin/roles/role.service';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {CurrentUser} from '@common/auth/current-user';
import {SelectRolesModalComponent} from '@common/admin/users/select-roles-modal/select-roles-modal.component';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'role-manager',
    templateUrl: './role-manager.component.html',
    styleUrls: ['./role-manager.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: RoleManagerComponent,
        multi: true,
    }]
})
export class RoleManagerComponent implements ControlValueAccessor {
    public roles$ = new BehaviorSubject<Role[]>([]);
    @Input() readonly = false;
    private propagateChange: Function;

    constructor(
        public users: Users,
        private roleApi: RoleService,
        private modal: Modal,
        public currentUser: CurrentUser,
    ) {}

    public openSelectRolesModal() {
        this.modal.open(
            SelectRolesModalComponent,
            {initialRoles: this.roles$.value},
        ).afterClosed().subscribe((roles: Role[]) => {
            if ( ! roles) return;
            this.setRoles(roles);
        });
    }

    public setRoles(roles: Role[]) {
        this.roles$.next(roles);
        this.propagateChange(this.roles$.value);
    }

    public detachRole(role: Role) {
        const roles = this.roles$.value.filter(r => r.id !== role.id);
        this.setRoles(roles);
    }

    public writeValue(value: Role[]) {
        this.roles$.next(value);
    }

    public registerOnChange(fn: Function) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {}
}
