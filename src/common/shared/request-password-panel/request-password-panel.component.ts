import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {GenericBackendResponse} from '@common/core/types/backend-response';

@Component({
    selector: 'request-password-panel',
    templateUrl: './request-password-panel.component.html',
    styleUrls: ['./request-password-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestPasswordPanelComponent {
    public passwordControl = new FormControl();
    public passwordError$ = new BehaviorSubject(false);

    @Input() config: {table: string, id: number};
    @Output() passwordValid = new EventEmitter(null);

    constructor(private http: AppHttpClient) {}

    public submitPassword() {
        const payload = {
            ...this.config,
            password: this.passwordControl.value,
        };
        this.http.post<GenericBackendResponse<{matches: boolean}>>('password/check', payload)
            .subscribe(response => {
               this.handlePasswordCheck(response.matches);
            }, () => {});
    }

    private handlePasswordCheck(matches: boolean) {
        this.passwordError$.next(!matches);
        if (matches) {
            this.passwordValid.emit(this.passwordControl.value);
        }
    }
}
