import { Injectable } from '@angular/core';
import { UploadValidator } from '@common/uploads/validation/upload-validator';
import { FileSizeValidation } from '@common/uploads/validation/validations/file-size-validation';
import { convertToBytes } from '@common/core/utils/convertToBytes';
import { AllowedExtensionsValidation } from '@common/uploads/validation/validations/allowed-extensions-validation';
import { BlockedExtensionsValidation } from '@common/uploads/validation/validations/blocked-extensions-validation';

@Injectable({
    providedIn: 'root'
})
export class DriveUploadValidator extends UploadValidator {
    protected readonly DEFAULT_MAX_FILE_SIZE_MB = 8;

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
