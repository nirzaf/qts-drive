import { HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpSentEvent, HttpUserEvent } from '@angular/common/http';
import { UploadFileResponse } from '@common/uploads/uploads-api.service';

export interface ChunkHttpProgressEvent extends HttpProgressEvent {
    // how many bytes user has uploaded for this file in a previous session
    initiallyLoaded?: number;
}

export type ChunkHttpEvent =
    HttpSentEvent
    | HttpHeaderResponse
    | HttpResponse<UploadFileResponse>
    | ChunkHttpProgressEvent
    | HttpUserEvent<UploadFileResponse>;
