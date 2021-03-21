import { HttpProgressEvent } from '@angular/common/http';
import { getUploadSpeed } from './get-upload-speed';

export function getUploadETA (e: HttpProgressEvent, uploadStarted: number) {
    if ( ! e.loaded) return 0;

    const uploadSpeed = getUploadSpeed(e, uploadStarted);
    let bytesRemaining = e.total - e.loaded;

    if (bytesRemaining < 0) {
        bytesRemaining = 0;
    }

    return Math.round(bytesRemaining / uploadSpeed * 10) / 10;
}
