import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '@common/auth/auth.service';
import {Settings} from '@common/core/config/settings.service';
import {Toast} from '@common/core/ui/toast.service';
import {CurrentUser} from '@common/auth/current-user';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';

@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    host: {'class': 'auth-page'},
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
    public loading$ = new BehaviorSubject<boolean>(false);
    public form = this.fb.group({
        email: [''],
        password: [''],
        password_confirmation: [''],
        token: [''],
    });
    public errors$ = new BehaviorSubject<{
        email?: string,
        password?: string,
    }>({});

    constructor(
        public auth: AuthService,
        public settings: Settings,
        private route: ActivatedRoute,
        private router: Router,
        private toast: Toast,
        private currentUser: CurrentUser,
        private fb: FormBuilder,
    ) {}

    public resetPassword() {
        this.loading$.next(true);
        this.form.patchValue({token: this.route.snapshot.params.token});
        this.auth.resetPassword(this.form.value).subscribe(response => {
            this.currentUser.assignCurrent(response.data);
            this.router.navigate([this.auth.getRedirectUri()]).then(() => {
                this.loading$.next(false);
                this.toast.open('Your password has been reset.');
            });
        }, (errResponse: BackendErrorResponse) => {
            this.errors$.next(errResponse.errors);
            this.loading$.next(false);
        });
    }
}
