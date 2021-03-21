import { UploadInputConfig } from '../upload-input-config';

/**
 * Create a html5 file upload input element.
 */
export function createUploadInput(config: UploadInputConfig = {}): HTMLElement {
    const old = document.querySelector('#hidden-file-upload-input');
    if (old) old.remove();

    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = config.multiple;
    input.classList.add('hidden');
    input.style.display = 'none';
    input.style.visibility = 'hidden';
    input.id = 'hidden-file-upload-input';

    const accept = [];

    if (config.extensions) {
        config.extensions = config.extensions.map(e => {
            return e.startsWith('.') ? e : '.' + e;
        });
        accept.push(config.extensions.join(','));
    }

    if (config.types) {
        accept.push(config.types.join(','));
    }

   if (accept.length) {
        input.accept = accept.join(',');
   }

    if (config.directory) {
        input.webkitdirectory = true;
    }

    document.body.appendChild(input);

    return input;
}
