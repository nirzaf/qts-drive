import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {
    SelectPermissionsModalComponent,
    SelectPermissionsModalData
} from '@common/admin/permissions/select-permissions-modal/select-permissions-modal.component';
import {Permission, PermissionRestriction} from '@common/core/types/models/permission';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'permission-manager',
    templateUrl: './permission-manager.component.html',
    styleUrls: ['./permission-manager.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: PermissionManagerComponent,
        multi: true,
    }]
})
export class PermissionManagerComponent implements ControlValueAccessor {
    @Input() valueListKey = 'permissions';
    @Input() hideRestrictions = false;
    public permissions$ = new BehaviorSubject<Permission[]>([]);
    private propagateChange: Function;

    constructor(private modal: Modal) {}

    public showSelectPermissionsModal() {
        this.modal.open(
            SelectPermissionsModalComponent,
            {
                initialPermissions: this.permissions$.value,
                valueListKey: this.valueListKey,
                hideRestrictions: this.hideRestrictions,
            } as SelectPermissionsModalData,
        ).afterClosed()
        .subscribe(permissions => {
            if ( ! permissions) return;
            this.setPermissions(permissions);
        });
    }

    public removePermission(name: string) {
        const permissions = this.permissions$.value.filter(p => p.name !== name);
        this.setPermissions(permissions);
    }

    public setPermissions(permissions: Permission[]) {
        this.permissions$.next(permissions);
        this.propagateChange(this.permissions$.value);
    }

    public getCountRestriction(permission: Permission): PermissionRestriction {
        return permission.restrictions.find(r => r.name === 'count');
    }

    public writeValue(value: Permission[]) {
        this.permissions$.next(value);
    }

    public registerOnChange(fn: Function) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {}
}
