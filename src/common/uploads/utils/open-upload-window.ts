import { createUploadInput } from './create-upload-input';
import { UploadedFile } from '../uploaded-file';
import { UploadInputConfig } from '../upload-input-config';

/**
 * Open browser dialog for uploading files and
 * resolve promise with uploaded files.
 */
export function openUploadWindow(config: UploadInputConfig = {}): Promise<UploadedFile[]> {
    return new Promise(resolve => {
        const input = createUploadInput(config);

        input.onchange = (e) => {
            const fileList = e.target['files'] as FileList,
                uploads = Array.from(fileList)
                .map(file => new UploadedFile(file));

            resolve(uploads);
            input.remove();
        };

        document.body.appendChild(input);
        input.click();
    });
}
