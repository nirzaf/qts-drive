import { InjectionToken } from '@angular/core';
import { FileEntry } from '@common/uploads/types/file-entry';

export type PreviewUrlTransformer = (entry: FileEntry) => string;

export const PREVIEW_URL_TRANSFORMER = new InjectionToken<PreviewUrlTransformer>('PREVIEW_URL_TRANSFORMER', {
    factory: () => {
        return entry => entry.url;
    },
    providedIn: 'root',
});
