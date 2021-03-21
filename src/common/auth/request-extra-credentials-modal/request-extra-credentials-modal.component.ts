import {ChangeDetectionStrategy, Component, Inject, NgZone, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Settings} from '../../core/config/settings.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';

export interface RequestExtraCredentialsModalData {
    credentials: string[];
}

interface PossibleCredentials {
    email?: string;
    password?: string;
}

@Component({
    selector: 'request-extra-credentials-modal',
    templateUrl: './request-extra-credentials-modal.component.html',
    styleUrls: ['./request-extra-credentials-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestExtraCredentialsModalComponent implements OnInit {
    public form = this.fb.group({
        email: [''],
        password: [''],
    });
    public credentialsToRequest: string[];
    public errors$ = new BehaviorSubject<PossibleCredentials>({});
    public onSubmit$ = new Subject<PossibleCredentials>();

    constructor(
        private dialogRef: MatDialogRef<RequestExtraCredentialsModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: RequestExtraCredentialsModalData,
        private zone: NgZone,
        public settings: Settings,
        private fb: FormBuilder,
    ) {}

    ngOnInit() {
        this.zone.run(() => {
            this.credentialsToRequest = this.data.credentials;
        });
    }

    public shouldCredentialBeRequested(name: string): boolean {
        return this.credentialsToRequest.indexOf(name) > -1;
    }

    public confirm() {
        this.onSubmit$.next({...this.form.value});
    }

    public close() {
        this.onSubmit$.complete();
        this.dialogRef.close();
    }

    public handleErrors(response: BackendErrorResponse) {
        // we need to request user extra credentials again, for example
        // if email address user supplied previously already exists
        // we might need to request password for account with that email
        if (response.errors.email) {
            this.credentialsToRequest.push('password');
        }

        this.zone.run(() => {
            this.errors$.next(response.errors);
        });
    }
}
