import { Injectable } from '@angular/core';
import { FileSizeValidation } from '../uploads/validation/validations/file-size-validation';
import { UploadValidator } from '../uploads/validation/upload-validator';
import { convertToBytes } from '../core/utils/convertToBytes';
import { FileTypeValidation } from '../uploads/validation/validations/file-type-validation';

@Injectable({
    providedIn: 'root'
})
export class AvatarValidator extends UploadValidator {
    protected readonly DEFAULT_MAX_SIZE_MB = 1.5;

    protected initValidations() {
        const validations = [
            new FileSizeValidation(
                {maxSize: convertToBytes(this.DEFAULT_MAX_SIZE_MB, 'MB')},
                this.i18n
            ),
            new FileTypeValidation({types: ['image']}, this.i18n),
        ];

        this.validations.push(...validations);
    }
}
