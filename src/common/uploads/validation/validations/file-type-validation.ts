import {UploadedFile} from '../../uploaded-file';
import {UploadValidation} from './upload-validation';
import {Translations} from '@common/core/translations/translations.service';

type MIMES = 'image'|'video'|'audio';

export class FileTypeValidation extends UploadValidation {
    constructor(
        protected params: {types: MIMES[]},
        protected i18n: Translations
    ) {
        super();

        this.errorMessage = this.params.types.length > 1 ?
            this.getPluralMessage() :
            this.getSingularMessage();
    }

    public fails(file: UploadedFile) {
        return ! this.params.types.some(type => {
            return type === (file.mime && file.mime.split('/')[0]);
        });
    }

    private getSingularMessage() {
        return this.i18n.t(
            'File must be a :type.',
            {type: this.i18n.t(this.params.types[0])}
        );
    }

    private getPluralMessage() {
        return this.i18n.t(
            'File must be one of these types: :types.',
            {types: this.i18n.t(this.params.types.join(', '))}
        );
    }
}
