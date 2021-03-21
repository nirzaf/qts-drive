import { Injectable } from '@angular/core';
import {UploadValidator} from './upload-validator';
import {FileSizeValidation} from './validations/file-size-validation';
import {AllowedExtensionsValidation} from './validations/allowed-extensions-validation';
import {BlockedExtensionsValidation} from './validations/blocked-extensions-validation';
import {convertToBytes} from '../../core/utils/convertToBytes';

@Injectable({
    providedIn: 'root'
})
export class DefaultUploadValidator extends UploadValidator {
    protected readonly DEFAULT_MAX_FILE_SIZE_MB = 8;
    public showToast = true;

    protected initValidations() {
        this.validations.push(
            new FileSizeValidation(
                {maxSize: this.getMaxFileSize()},
                this.i18n
            )
        );

        const allowedExtensions = this.getAllowedExtensions(),
            blockedExtensions = this.getBlockedExtensions();

        if (allowedExtensions && allowedExtensions.length) {
            this.validations.push(new AllowedExtensionsValidation(
                {extensions: allowedExtensions}, this.i18n
            ));
        }

        if (blockedExtensions && blockedExtensions.length) {
            this.validations.push(new BlockedExtensionsValidation(
                {extensions: blockedExtensions}, this.i18n
            ));
        }
    }

    protected getMaxFileSize(): number {
        return this.settings.get(
            'uploads.max_size',
            convertToBytes(this.DEFAULT_MAX_FILE_SIZE_MB, 'MB')
        );
    }

    protected getAllowedExtensions() {
        return this.settings.getJson('uploads.allowed_extensions');
    }

    protected getBlockedExtensions() {
        return this.settings.getJson('uploads.blocked_extensions');
    }
}
