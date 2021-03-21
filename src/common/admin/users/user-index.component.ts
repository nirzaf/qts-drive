import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {CrupdateUserModalComponent} from './crupdate-user-modal/crupdate-user-modal.component';
import {User} from '@common/core/types/models/User';
import {Users} from '@common/auth/users.service';
import {CurrentUser} from '@common/auth/current-user';
import {Settings} from '@common/core/config/settings.service';
import {Toast} from '@common/core/ui/toast.service';
import {HttpErrors} from '@common/core/http/errors/http-errors.enum';
import {Role} from '@common/core/types/models/Role';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';
import {DatatableService} from '../../datatable/datatable.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'user-index',
    templateUrl: './user-index.component.html',
    styleUrls: ['./user-index.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DatatableService],
})
export class UserIndexComponent implements OnInit, OnDestroy {
    public users$ = this.datatable.data$ as Observable<User[]>;

    constructor(
        private userService: Users,
        public currentUser: CurrentUser,
        public settings: Settings,
        private toast: Toast,
        public datatable: DatatableService<User>,
    ) {}

    ngOnInit() {
        this.datatable.init({
            uri: Users.BASE_URI,
        });
    }

    ngOnDestroy() {
        this.datatable.destroy();
    }

    public makeRolesList(roles: Role[]): string {
        return roles.slice(0, 3).map(role => role.name).join(', ');
    }

    public maybeDeleteSelectedUsers() {
        this.datatable.confirmResourceDeletion('users')
            .subscribe(() => {
                this.userService.delete(this.datatable.selectedRows$.value).subscribe(() => {
                    this.datatable.reset();
                    this.toast.open('Deleted selected users');
                }, (errResponse: BackendErrorResponse) => {
                    this.toast.open(errResponse.message || HttpErrors.Default);
                });
            });
    }

    public showCrupdateUserModal(user?: User) {
        this.datatable.openCrupdateResourceModal(
            CrupdateUserModalComponent,
            {user},
        ).subscribe();
    }
}
