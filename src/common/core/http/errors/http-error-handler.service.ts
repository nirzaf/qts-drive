import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Translations } from '../../translations/translations.service';
import { BackendErrorResponse } from '../../types/backend-error-response';
import { Injectable } from '@angular/core';
import { Toast } from '@common/core/ui/toast.service';
import { HttpErrors } from '@common/core/http/errors/http-errors.enum';

@Injectable({
    providedIn: 'root'
})
export abstract class HttpErrorHandler {
    protected constructor(
        protected i18n: Translations,
        protected toast: Toast,
    ) {}

    public handle(response: HttpErrorResponse, uri?: string, options: {[key: string]: any} = {}): Observable<never> {
        const errResponse = ((typeof response.error === 'object' && response.error !== null) ? response.error : {}) as BackendErrorResponse;
        errResponse.status = response.status;
        errResponse.type = 'http';

        if ( ! errResponse.errors) {
            errResponse.errors = {};
        }

        Object.keys(errResponse.errors).forEach(key => {
            const message = errResponse.errors[key];
            errResponse.errors[key] = Array.isArray(message) ? message[0] : message;
        });

        if (!options.suppressAuthToast && (errResponse.status === 403 || errResponse.status === 401)) {
            this.handle403Error(errResponse);
        } else if (errResponse.status === 422 && errResponse.message && !Object.keys(errResponse.errors).length) {
            this.toast.open(errResponse.message, {duration: 15000});
        } else if (errResponse.status === 500) {
            const message = (errResponse?.message || HttpErrors.Default).substring(0, 200);
            this.toast.open(message, {duration: 15000});
        }

        return throwError(errResponse);
    }

    /**
     * Redirect user to login page or show toast informing
     * user that he does not have required permissions.
     */
    protected abstract handle403Error(response: BackendErrorResponse);
}
