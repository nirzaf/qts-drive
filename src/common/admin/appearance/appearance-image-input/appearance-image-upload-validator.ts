import { Injectable } from '@angular/core';
import {UploadValidator} from '@common/uploads/validation/upload-validator';
import {FileSizeValidation} from '@common/uploads/validation/validations/file-size-validation';
import {convertToBytes} from '@common/core/utils/convertToBytes';
import {FileTypeValidation} from '@common/uploads/validation/validations/file-type-validation';

@Injectable({
    providedIn: 'root'
})
export class AppearanceImageUploadValidator extends UploadValidator {
    protected readonly DEFAULT_MAX_SIZE_MB = 5;

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
