import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { randomString } from '../../core/utils/random-string';
import { UploadedFile } from '../uploaded-file';
import { FileEntry } from '../types/file-entry';
import { UploadFileResponse } from '@common/uploads/uploads-api.service';

export interface UploadQueueItemProgress {
    percentage?: number;
    speed?: string;
    eta?: string;
    totalBytes?: number;
    completedBytes?: number;
}

export class UploadQueueItem {
    id: string;
    canceled$: Subject<boolean> = new Subject();
    processing$ = new BehaviorSubject<boolean>(false);

    // file info (static)
    uploadedFile: UploadedFile;

    // backend response once file is uploaded
    uploadedResponse$ = new ReplaySubject<UploadFileResponse>(1);

    // uploaded file entry (only available on completed uploads)
    fileEntry: FileEntry;

    // upload progress information (will change)
    progress$ = new BehaviorSubject<UploadQueueItemProgress>({percentage: 0});

    error$ = new BehaviorSubject<string>(null);

    // custom data that can be attached to queue item
    public customData: object = {};

    get completed(): boolean {
        return !this.processing$.value && this.progress$.value.percentage === 100;
    }

    get inProgress(): boolean {
        return !this.error$.value && !this.completed;
    }

    constructor(file: UploadedFile, queueId?: string) {
        this.uploadedFile = file;
        this.id = queueId || randomString();
    }

    public cancel() {
        // cancelling before finalizing might cause infinite loop
        this.canceled$.next(true);
        this.finalize();
    }

    public complete() {
        this.setProgress({percentage: 100, eta: null});
        this.finalize();
    }

    public finalize() {
        this.uploadedResponse$.complete();
        this.canceled$.complete();
        this.progress$.complete();
    }

    public finishProcessing() {
        this.processing$.next(false);
        this.processing$.complete();
    }

    public addError(message: string) {
        this.error$.next(message);
    }

    public setProgress(data: Partial<UploadQueueItemProgress>) {
        this.progress$.next({
            ...this.progress$.value,
            ...data,
        });
    }
}
