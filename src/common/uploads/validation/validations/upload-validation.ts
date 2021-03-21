import { UploadedFile } from '../../uploaded-file';

export abstract class UploadValidation {
    public errorMessage: string;
    abstract fails(file: UploadedFile): boolean;

    public passes(file: UploadedFile) {
        return ! this.fails(file);
    }
}
