import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {finalize} from 'rxjs/operators';
import {CurrentUser} from '@common/auth/current-user';
import {User} from '@common/core/types/models/User';
import {Users} from '@common/auth/users.service';
import {Toast} from '@common/core/ui/toast.service';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {AuthService} from '@common/auth/auth.service';
import {Settings} from '@common/core/config/settings.service';
import {UploadApiConfig} from '@common/uploads/types/upload-api-config';
import {AvatarValidator} from '@common/account-settings/avatar-validator';
import {UploadUri} from '@common/uploads/types/upload-uri.enum';
import {randomString} from '@common/core/utils/random-string';
import {HttpErrors} from '@common/core/http/errors/http-errors.enum';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';

export interface CrupdateUserModalData {
    user?: User;
}

@Component({
    selector: 'crupdate-user-modal',
    templateUrl: './crupdate-user-modal.component.html',
    styleUrls: ['./crupdate-user-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrupdateUserModalComponent implements OnInit {
    public loading$ = new BehaviorSubject<boolean>(false);
    public form = this.fb.group({
        email: [''],
        password: [''],
        avatar: [''],
        first_name: [''],
        last_name: [''],
        email_verified_at: [false],
        available_space: [''],
        roles: [],
        permissions: [],
    });
    public errors$ = new BehaviorSubject<Partial<User>>({});

    constructor(
        private dialogRef: MatDialogRef<CrupdateUserModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateUserModalData,
        public users: Users,
        private toast: Toast,
        public currentUser: CurrentUser,
        private fb: FormBuilder,
        private auth: AuthService,
        private settings: Settings,
        private avatarValidator: AvatarValidator,
    ) {}

    ngOnInit() {
        if (this.data.user) {
            // password input should always be empty
            this.form.patchValue({
                ...this.data.user,
                password: null,
                email_verified_at: !!this.data.user.email_verified_at
            });
        }
    }
    
    public confirm() {
        if (this.loading$.value) {
            return;
        }
        let request;
        const payload = this.getPayload();

        this.loading$.next(true);

        if (this.data.user) {
            request = this.users.update(this.data.user.id, payload);
        } else {
            request = this.users.create(payload);
        }

        request.pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.close(response.user);
                const action = this.data.user ? 'updated' : 'created';
                this.toast.open('User ' + action);
            }, (errResponse: BackendErrorResponse) => this.errors$.next(errResponse.errors));
    }
    
    public close(data?: any) {
        this.dialogRef.close(data);
    }
    
    private getPayload() {
        const payload = {...this.form.value};
        payload.roles = (payload.roles || []).map(role => role.id);
        payload.permissions = (payload.permissions || []);
        if ( ! payload.password) {
            delete payload.password;
        }
        payload.email_verified_at = payload.email_verified_at ? new Date() : null;
        return payload;
    }

    public sendEmailConfirmation() {
        this.loading$.next(true);
        this.auth.resendEmailConfirmation(this.data.user.email)
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(() => {
                this.toast.open('Verification email re-sent.');
            }, (errResponse: BackendErrorResponse) => {
                this.toast.open(errResponse.message || HttpErrors.Default);
            });
    }

    public shouldShowResendButton(): boolean {
        return this.data.user &&
            this.data.user.id &&
            this.settings.get('require_email_confirmation') &&
            !this.form.get('email_verified_at').value;
    }

    public avatarUploadConfig(): UploadApiConfig {
        const uri = this.data.user ?
            `users/${this.data.user.id}/avatar` :
            UploadUri.Image;
        return {
            uri: uri,
            httpParams: {diskPrefix: 'avatars'},
            validator: this.avatarValidator,
        };
    }

    public generateNewPassword() {
        this.form.patchValue({password: randomString(15)});
    }
}
