import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CurrentUser} from '@common/auth/current-user';
import {Toast} from '@common/core/ui/toast.service';
import {HttpErrors} from '@common/core/http/errors/http-errors.enum';
import {Router} from '@angular/router';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';
import {DatatableService} from '../../datatable/datatable.service';
import {CrupdateCustomDomainModalComponent} from '../crupdate-custom-domain-modal/crupdate-custom-domain-modal.component';
import {CustomDomain} from '../custom-domain';
import {CustomDomainService} from '../custom-domain.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'custom-domain-index',
    templateUrl: './custom-domain-index.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DatatableService],
})
export class CustomDomainIndexComponent implements OnInit {
    public domains$ = this.datatable.data$ as Observable<CustomDomain[]>;
    constructor(
        public datatable: DatatableService<CustomDomain>,
        public currentUser: CurrentUser,
        protected customDomains: CustomDomainService,
        protected toast: Toast,
        protected router: Router,
    ) {}

    ngOnInit() {
        this.datatable.init({
            uri: CustomDomainService.BASE_URI,
        });
    }

    public maybeDeleteSelectedDomains() {
        this.datatable.confirmResourceDeletion('domains')
            .subscribe(() => {
                this.customDomains.delete(this.datatable.selectedRows$.value).subscribe(() => {
                    this.datatable.reset();
                    this.toast.open('Domains deleted.');
                }, (errResponse: BackendErrorResponse) => {
                    this.toast.open(errResponse.message || HttpErrors.Default);
                });
            });
    }

    public showCrupdateDomainModal(domain?: CustomDomain) {
        this.datatable.openCrupdateResourceModal(CrupdateCustomDomainModalComponent, {domain})
            .subscribe();
    }

    public showUserColumn(): boolean {
        return this.router.url.indexOf('admin') > -1;
    }
}
