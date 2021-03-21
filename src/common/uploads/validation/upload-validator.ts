import { Settings } from '../../core/config/settings.service';
import { Toast } from '../../core/ui/toast.service';
import { UploadValidation } from './validations/upload-validation';
import { UploadedFile } from '../uploaded-file';
import { Translations } from '../../core/translations/translations.service';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export abstract class UploadValidator {
    protected validations: UploadValidation[] = [];
    public showToast: boolean;

    constructor(
        protected settings: Settings,
        protected toast: Toast,
        protected i18n: Translations
    ) {}

    /**
     * Return true of file passes all validations.
     */
    public validate(file: UploadedFile): {failed: boolean, errorMessage?: string} {
        if ( ! this.validations.length) this.initValidations();

        const failed = this.validations.find(validation => {
            return validation.fails(file);
        });

        if (failed && this.showToast) {
            this.openErrorToast(failed.errorMessage);
        }

        return {failed: !!failed, errorMessage: failed ? failed.errorMessage : null};
    }

    /**
     * Validate file and show error message in toast.
     */
    public validateWithToast(file: UploadedFile) {
        const response = this.validate(file);
        if (response.failed) {
            this.openErrorToast(response.errorMessage);
        }
        return response;
    }

    /**
     * Show specified error message in toast.
     */
    protected openErrorToast(message: string) {
        this.toast.open(message);
    }

    /**
     * Can't init validators in constructor, because ngxs
     * store injects do not wait for angular APP_INITIALIZER
     */
    protected abstract initValidations();
}
