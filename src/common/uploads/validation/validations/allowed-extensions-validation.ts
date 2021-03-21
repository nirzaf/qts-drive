import { UploadedFile } from '../../uploaded-file';
import { UploadValidation } from './upload-validation';
import { Translations } from '../../../core/translations/translations.service';

export class AllowedExtensionsValidation extends UploadValidation {
    constructor(
        protected params: {extensions: string[]},
        protected i18n: Translations
    ) {
        super();

        this.errorMessage = this.i18n.t(
            'Only these file types are allowed: :extensions',
            {extensions: this.params.extensions.join(', ')}
        );
    }

    public fails(file: UploadedFile) {
        return ! this.params.extensions.some(extension => {
            return extension.toLowerCase() === file.extension.toLowerCase();
        });
    }
}
