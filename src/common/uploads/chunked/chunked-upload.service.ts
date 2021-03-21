import { Injectable } from '@angular/core';
import { UploadedFile } from '@common/uploads/uploaded-file';
import { makeUploadPayload } from '@common/core/utils/make-upload-payload';
import { from, Observable, of } from 'rxjs';
import {
    transformAngularUploadEvent, UploadCompletedEvent, UploadEvent, UploadEventTypes, UploadProgressEvent
} from '@common/uploads/utils/upload-progress-event';
import { filter, map, mergeMap, startWith, switchMap, tap } from 'rxjs/operators';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { UploadFileResponse } from '@common/uploads/uploads-api.service';
import { AppHttpClient } from '@common/core/http/app-http-client.service';
import { Settings } from '@common/core/config/settings.service';
import { BackendResponse } from '@common/core/types/backend-response';
import { FileEntry } from '@common/uploads/types/file-entry';
import { getUploadProgress } from '@common/uploads/utils/get-upload-progress';
import { ChunkHttpEvent } from '@common/uploads/chunked/chunk-http-event';
import { UploadHttpParams } from '@common/uploads/types/upload-http-params';
import {slugifyString} from '@common/core/utils/slugify-string';

interface UploadSessionResponse {
    uploadedChunks: {number: number, size: number}[];
    fileEntry: FileEntry|null;
}

interface ChunkHttpParams extends UploadHttpParams {
    _chunkCount?: number;
    _originalFileName?: string;
    _originalFileSize?: number;
    _fingerprint?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ChunkedUploadService {
    public readonly sliceSize: number;
    private totalChunks: number;
    private uploadedChunksCount = 0;
    private fingerprint: string;
    private file: UploadedFile;
    private httParams: ChunkHttpParams;
    private chunks: FormData[];

    constructor(
        private http: AppHttpClient,
        private settings: Settings,
    ) {
        this.sliceSize = this.settings.get('uploads.chunk_size', 5242880);
    }

    public start(file: UploadedFile, httpParams: UploadHttpParams = {}): Observable<UploadEvent> {
        return this.reset(file, httpParams).pipe(switchMap(response => {
            const now = Date.now();
            const initiallyLoaded = response.uploadedChunks.reduce((a, b) => a + b.size, 0);
            let totalLoaded = initiallyLoaded;

            // all chunks for this upload session were already uploaded
            if (response.fileEntry) {
                return of(this.transformUploadSessionResponse(response));
            }

            return from(this.chunks)
                .pipe(
                    mergeMap(chunk => {
                        let loadedLastRequest = 0;
                        return this.http.postWithProgress('uploads/sessions/chunks', chunk)
                            .pipe(map((e: ChunkHttpEvent) => {
                                if (e.type === HttpEventType.UploadProgress) {
                                    e.initiallyLoaded = initiallyLoaded;
                                    e.total = file.size;
                                    // need to sum only the amount of bytes loaded this request and not total bytes loaded
                                    const loadedThisRequest = e.loaded - loadedLastRequest;
                                    loadedLastRequest = e.loaded;
                                    e.loaded = totalLoaded += loadedThisRequest;

                                    // sometimes bytes might get out of sync for last chunk
                                    if (e.loaded > e.total) {
                                        e.loaded = e.total - 1;
                                    }
                                }
                                return e;
                            }));
                    }, 3),
                    map((e: HttpEvent<UploadFileResponse>) => transformAngularUploadEvent(e, now)),
                    tap(e => {
                        if (e.name === UploadEventTypes.COMPLETED) {
                            this.uploadedChunksCount++;
                        }
                    }),
                    filter(e => {
                        // only need to let through all upload progress events and upload completed event for the very last chunk
                        return e.name === UploadEventTypes.PROGRESS || this.isLastChunkCompletedEvent(e);
                    }),
                    switchMap(e => {
                        if (this.isLastChunkCompletedEvent(e)) {
                            e = e as UploadCompletedEvent;
                            if (e?.body?.fileEntry) {
                                return of(this.transformUploadSessionResponse(e.body as UploadSessionResponse));
                            } else {
                                return this.fetchUploadSession().pipe(map(r => this.transformUploadSessionResponse(r)));
                            }
                        } else {
                            return of(e);
                        }
                    }),
                    startWith(this.getInitialUploadProgressEvent())
                );
        }));
    }

    private getInitialUploadProgressEvent(): UploadProgressEvent {
        const completedBytes = this.uploadedChunksCount * this.sliceSize;
        return {
            type: HttpEventType.UploadProgress,
            name: UploadEventTypes.PROGRESS,
            totalBytes: this.file.size,
            completedBytes,
            progress: getUploadProgress(completedBytes, this.file.size),
            speed: null,
            eta: null,
        };
    }

    private isLastChunkCompletedEvent(e: UploadEvent) {
        return e.name === UploadEventTypes.COMPLETED && this.uploadedChunksCount === this.totalChunks;
    }

    private transformUploadSessionResponse(response: UploadSessionResponse): UploadCompletedEvent {
        return {type: HttpEventType.Response, name: UploadEventTypes.COMPLETED, body: response};
    }

    private reset(file: UploadedFile, httpParams: object) {
        this.file = file;
        this.httParams = httpParams;
        this.chunks = [];
        this.uploadedChunksCount = 0;
        this.totalChunks = Math.ceil(this.file.size / this.sliceSize);
        this.generateFingerprint();
        this.generateHttpParams();

        return this.loadExistingChunks()
            .pipe(tap(response => {
                this.uploadedChunksCount = response.uploadedChunks.length;
                this.generateChunks(response.uploadedChunks);
            }));
    }

    private loadExistingChunks(): Observable<UploadSessionResponse> {
        if (this.settings.get('uploads.resume')) {
            return this.fetchUploadSession();
        } else {
            return of({uploadedChunks: [], fileEntry: null});
        }
    }

    private fetchUploadSession(): BackendResponse<UploadSessionResponse> {
        return this.http.post('uploads/sessions/load', this.httParams);
    }

    private generateChunks(existingChunks: {number: number, size: number}[] = []) {
        let chunkNumber = 0;
        for (let start = 0; start < this.file.size; start += this.sliceSize) {
            // if chunk already uploaded, continue
            if ( ! existingChunks.find(c => c.number === chunkNumber)) {
                const end = start + this.sliceSize;
                const chunkHttpParams = {
                    ...this.httParams,
                    _chunkStart: start,
                    _chunkEnd: end,
                    _chunkNumber: chunkNumber,
                };
                this.chunks.push(makeUploadPayload(this.file.native.slice(start, end), chunkHttpParams));
            }
            chunkNumber++;
        }
    }

    private generateFingerprint() {
        this.fingerprint = btoa([
            'be-upload',
            slugifyString(this.file.name, '-', true),
            this.file.mime,
            this.file.size,
            this.file.lastModified,
            slugifyString(this.file.relativePath, '-', true),
        ].join('|'));
    }

    private generateHttpParams() {
        this.httParams = {
            ...this.httParams,
            _chunkCount: this.totalChunks,
            _originalFileName: this.file.name,
            _originalFileSize: this.file.size,
            _fingerprint: this.fingerprint,
        };
    }
}
