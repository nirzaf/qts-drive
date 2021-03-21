import { UploadedFile } from '../../uploaded-file';
import { UploadValidation } from './upload-validation';

export class FileCountValidation extends UploadValidation {
    errorMessage = 'e';
    constructor(protected count: number) {
        super();
    }

    public fails(file: UploadedFile) {
        return false;
    }
}
