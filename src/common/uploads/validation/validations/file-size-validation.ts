import { UploadedFile } from '../../uploaded-file';
import { UploadValidation } from './upload-validation';
import {Translations} from '@common/core/translations/translations.service';
import {prettyBytes} from '@common/core/utils/pretty-bytes';

export class FileSizeValidation extends UploadValidation {
    constructor(
        protected params: {maxSize: number},
        protected i18n: Translations
    ) {
        super();

        this.errorMessage = this.i18n.t(
            'Maximum file size is :number',
            {number: prettyBytes(+this.params.maxSize)}
        );
    }

    public fails(file: UploadedFile) {
        return this.params.maxSize < file.size;
    }
}
