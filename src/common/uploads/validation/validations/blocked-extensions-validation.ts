import { UploadedFile } from '../../uploaded-file';
import { UploadValidation } from './upload-validation';
import {Translations} from '@common/core/translations/translations.service';

export class BlockedExtensionsValidation extends UploadValidation {
    constructor(
        protected params: {extensions: string[]},
        protected i18n: Translations
    ) {
        super();

        this.errorMessage = this.i18n.t(
            'These file types are not allowed: :extensions',
            {extensions: this.params.extensions.join(', ')}
        );
    }

    public fails(file: UploadedFile) {
        return this.params.extensions.some(extension => {
            return extension === file.extension;
        });
    }
}
