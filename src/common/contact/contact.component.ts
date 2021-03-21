import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Settings} from '../core/config/settings.service';
import {AppHttpClient} from '../core/http/app-http-client.service';
import {Toast} from '../core/ui/toast.service';
import {BehaviorSubject} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {Router} from '@angular/router';
import {RecaptchaService} from '../core/services/recaptcha.service';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';

@Component({
    selector: 'contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit {
    public loading$ = new BehaviorSubject<boolean>(false);

    public form = new FormGroup({
        name: new FormControl(),
        email: new FormControl(),
        message: new FormControl()
    });

    public errors$ = new BehaviorSubject<{
        name?: string;
        email?: string;
        message?: string;
    }>({});

    constructor(
        public settings: Settings,
        private http: AppHttpClient,
        private toast: Toast,
        private router: Router,
        private recaptcha: RecaptchaService,
    ) {}

    ngOnInit() {
        if (this.recaptcha.enabledFor('contact')) {
            this.recaptcha.load();
        }
    }

    public async submitMessage() {
        this.loading$.next(true);

        if (this.recaptcha.enabledFor('contact') && ! await this.recaptcha.verify('contact')) {
            return this.toast.open('Could not verify you are human.');
        }

        this.http.post('contact-page', this.form.value)
            .pipe(finalize(() => {
                this.loading$.next(false);
            })).subscribe(() => {
                this.errors$.next({});
                this.toast.open('Your message has been submitted.');
                this.router.navigate(['/']);
            }, (errResponse: BackendErrorResponse) => this.errors$.next(errResponse.errors));
    }
}
