import {CurrentUser} from '../auth/current-user';
import {BackendErrorResponse} from '../core/types/backend-error-response';
import {Directive, Injector, OnDestroy, OnInit} from '@angular/core';
import {snakeCase} from '../core/utils/snake-case';
import {Toast} from '../core/ui/toast.service';
import {HttpErrors} from '../core/http/errors/http-errors.enum';
import {ComponentType} from '@angular/cdk/overlay';
import {Messages} from '../../app/messages.enum';
import {Router} from '@angular/router';
import {ConfirmModalComponent} from '../core/ui/confirm-modal/confirm-modal.component';
import {ucFirst} from '../core/utils/uc-first';
import {Modal} from '../core/ui/dialogs/modal.service';
import {startCase} from '../core/utils/start-case';
import {Settings} from '../core/config/settings.service';
import {DatatableService} from './datatable.service';
import {BackendResponse} from '../core/types/backend-response';

interface ApiService {
    delete(id: number[]): BackendResponse<any>;
}

@Directive()
export abstract class DatatableComponent<T> implements OnInit, OnDestroy {
    public abstract resourceName: string;
    protected abstract uri: string;
    protected abstract apiService: ApiService;

    constructor(
        public currentUser: CurrentUser,
        public settings: Settings,
        public datatable: DatatableService<T>,
        protected modal: Modal,
        protected toast: Toast,
        protected router: Router,
        protected injector: Injector,
    ) {}

    ngOnInit() {
        this.datatable.init({
            uri: this.uri,
        });
    }

    ngOnDestroy() {
        this.datatable.paginator.destroy();
    }

    public maybeDeleteSelectedResources() {
        const pluralName = this.pluralizeResourceName();
        this.modal.show(ConfirmModalComponent, {
            title: `Delete ${ucFirst(pluralName)}`,
            body:  `Are you sure you want to delete selected ${pluralName.toLowerCase()}?`,
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.deleteSelectedResources();
            }
        });
    }

    public deleteSelectedResources() {
        this.apiService.delete(this.datatable.selectedRows$.value).subscribe(() => {
            this.datatable.reset();
            this.toast.open(Messages[`${snakeCase(this.resourceName).toUpperCase()}_DELETE_SUCCESS`]);
        }, (errResponse: BackendErrorResponse) => {
            this.toast.open(errResponse.message || HttpErrors.Default);
            this.datatable.reset();
        });
    }

    protected showCrupdateResourceModal(component: ComponentType<any>, data: object) {
        this.modal.open(component, data).beforeClosed().subscribe(modifiedResource => {
            if (modifiedResource) {
                this.datatable.reset();
            }
        });
    }

    private pluralizeResourceName() {
        return startCase(this.resourceName + 's');
    }
}
