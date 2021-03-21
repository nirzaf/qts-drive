import {Injectable, NgZone} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CurrentUser} from './current-user';
import {Toast} from '../core/ui/toast.service';
import {User} from '../core/types/models/User';
import {BehaviorSubject, Observable} from 'rxjs';
import {Settings} from '../core/config/settings.service';
import {AppHttpClient} from '../core/http/app-http-client.service';
import {BackendResponse} from '../core/types/backend-response';
import { AccessToken } from '@common/core/types/models/access-token';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    public forcedEmail$ = new BehaviorSubject(null);
    constructor(
        protected httpClient: AppHttpClient,
        protected currentUser: CurrentUser,
        protected router: Router,
        protected route: ActivatedRoute,
        protected toast: Toast,
        protected zone: NgZone,
        protected config: Settings,
    ) {}

    public login(credentials: object): BackendResponse<{data: string}> {
        return this.httpClient.post('auth/login', credentials);
    }

    public register(credentials: object): BackendResponse<{bootstrapData?: string, message?: string}> {
        return this.httpClient.post('auth/register', credentials);
    }

    public logOut() {
        this.httpClient.post('auth/logout').subscribe(() => {
            this.currentUser.assignCurrent();
            this.router.navigate(['/login']);
        });
    }

    public sendPasswordResetLink(credentials: object): Observable<{ data: string }> {
        return this.httpClient.post('auth/password/email', credentials);
    }

    public resetPassword(credentials: object): Observable<{ data: User }> {
        return this.httpClient.post('auth/password/reset', credentials);
    }

    public resendEmailConfirmation(email: string): BackendResponse<void> {
        return this.httpClient.post('auth/email/verify/resend', {email});
    }

    public revokeAccessToken(tokenId: number): BackendResponse<void> {
        return this.httpClient.delete('access-tokens/' + tokenId);
    }

    public createAccessToken(tokenName: string): BackendResponse<{token: AccessToken, plainTextToken: string}> {
        return this.httpClient.post('access-tokens', {tokenName});
    }

    /**
     * Get URI user should be redirect to after login.
     */
    public getRedirectUri(): string {
        if (this.currentUser.redirectUri) {
            const redirectUri = this.currentUser.redirectUri;
            this.currentUser.redirectUri = null;
            return redirectUri;
        } else if (this.currentUser.isAdmin()) {
            return this.config.get('vebto.auth.adminRedirectUri');
        } else {
            return this.config.get('vebto.auth.redirectUri');
        }
    }
}
