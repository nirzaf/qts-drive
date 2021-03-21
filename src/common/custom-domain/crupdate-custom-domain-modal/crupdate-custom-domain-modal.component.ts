import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Toast} from '@common/core/ui/toast.service';
import {FormControl, FormGroup} from '@angular/forms';
import {CustomDomainService} from '../custom-domain.service';
import {CustomDomain} from '../custom-domain';
import {finalize} from 'rxjs/operators';
import {Settings} from '@common/core/config/settings.service';
import {Router} from '@angular/router';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';

interface CrupdateCustomDomainModalData {
    domain: CustomDomain;
    resourceName: string;
}

enum Steps {
    Host = 1,
    Info = 2,
    Validate = 3,
    Finalize = 4
}

@Component({
    selector: 'crupdate-custom-domain-modal',
    templateUrl: './crupdate-custom-domain-modal.component.html',
    styleUrls: ['./crupdate-custom-domain-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrupdateCustomDomainModalComponent {
    public Steps = Steps;
    public serverIp: string;
    public currentStep$ = new BehaviorSubject<number>(1);
    public loading$ = new BehaviorSubject(false);
    public disabled$ = new BehaviorSubject(false);
    public updating$ = new BehaviorSubject(false);
    public errors$ = new BehaviorSubject<{host?: string}>({});
    public form = new FormGroup({
        host: new FormControl(),
        global: new FormControl(false),
    });

    constructor(
        private dialogRef: MatDialogRef<CrupdateCustomDomainModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateCustomDomainModalData,
        private customDomains: CustomDomainService,
        private toast: Toast,
        private settings: Settings,
        private router: Router,
    ) {
        this.updating$.next(!!data.domain);
        if (data.domain) {
            this.form.patchValue(data.domain);
        }
    }

    private connectDomain() {
        this.loading$.next(true);
        const request = this.updating$.value ?
            this.customDomains.update(this.data.domain.id, this.form.value) :
            this.customDomains.create(this.form.value);

        request.pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.toast.open('Domain connected');
                this.close(response.domain);
            }, (errResponse: BackendErrorResponse) => this.errors$.next(errResponse.errors));
    }

    public validateCname() {
        this.disabled$.next(true);
        this.loading$.next(true);
        this.customDomains.validate(this.form.value.host)
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                if (response && response.result === 'connected') {
                   this.nextStep();
                }
            }, () => {});
    }

    private authorizeCrupdate() {
        this.loading$.next(true);
        const payload = {...this.form.value};
        if (this.data.domain) {
            payload.domainId = this.data.domain.id;
        }
        this.customDomains.authorizeCrupdate(payload)
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.serverIp = response.serverIp;
                this.nextStep(true);
            }, (errResponse: BackendErrorResponse) => this.errors$.next(errResponse.errors));
    }

    public close(domain?: CustomDomain) {
        this.dialogRef.close(domain);
    }

    public previousStep() {
        if (this.currentStep$.value > Steps.Host) {
            this.currentStep$.next(this.currentStep$.value - 1);
        }
    }

    public nextStep(skipAuthorize = false) {
        // run authorization before asking user to change their DNS
        // in case they don't have permissions to create new domains
        if (this.currentStep$.value === Steps.Host && !skipAuthorize) {
            return this.authorizeCrupdate();
        }

        this.currentStep$.next(this.currentStep$.value + 1);
        if (this.currentStep$.value === Steps.Validate) {
            // host did not change, no need to re-validate
            if (this.data.domain && this.form.value.host === this.data.domain.host) {
                this.connectDomain();
            } else {
                this.validateCname();
            }
        } else if (this.currentStep$.value === Steps.Finalize) {
            this.connectDomain();
        } else {
            //
        }
    }

    public baseUrl(): string {
        return this.settings.getBaseUrl().replace(/\/$/, '');
    }

    public isSubdomain() {
        return (this.form.controls.host.value.match(/\./g) || []).length > 1;
    }

    public insideAdmin(): boolean {
        return this.router.url.indexOf('admin') > -1;
    }
}
