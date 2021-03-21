import {Injectable, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {HttpErrorHandler} from '@common/core/http/errors/http-error-handler.service';
import {Translations} from '@common/core/translations/translations.service';
import {CurrentUser} from '@common/auth/current-user';
import {Toast, TOAST_WITH_ACTION_DURATION, ToastConfig} from '@common/core/ui/toast.service';
import {Settings} from '@common/core/config/settings.service';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {CommonMessages} from '@common/core/ui/common-messages.enum';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';

@Injectable({
    providedIn: 'root'
})
export class BackendHttpErrorHandler extends HttpErrorHandler {
    constructor(
        protected i18n: Translations,
        protected currentUser: CurrentUser,
        protected router: Router,
        protected toast: Toast,
        protected zone: NgZone,
        protected settings: Settings,
        protected modal: Modal,
    ) {
        super(i18n, toast);
    }

    /**
     * Redirect user to login page or show toast informing
     * user that he does not have required permissions.
     */
    protected handle403Error(response: BackendErrorResponse) {
        // if user doesn't have access, navigate to login page
        if (this.currentUser.isLoggedIn() || response.message.includes('demo site')) {
            this.showToast(response);
        } else {
            this.router.navigate(['/login']);
        }
    }

    protected showToast(response: BackendErrorResponse) {
        const config: ToastConfig = {};
        if (response.action) {
            config.action = response.action.label;
            config.duration = TOAST_WITH_ACTION_DURATION;
        }
        this.toast.open(response.message || CommonMessages.NoPermissions, config)
            .onAction()
            .subscribe(() => {
                this.router.navigateByUrl(response.action.action);
                this.modal.closeAll();
            });
    }
}
