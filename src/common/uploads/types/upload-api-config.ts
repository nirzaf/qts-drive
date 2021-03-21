import {UploadValidator} from '@common/uploads/validation/upload-validator';
import {UploadHttpParams} from '@common/uploads/types/upload-http-params';

export interface UploadApiConfig {
    uri?: string;
    validator?: UploadValidator;
    bubbleError?: boolean;
    // whether files should be marked as "processing"
    // after they are fully uploaded (on 100% upload progress)
    willProcessFiles?: boolean;
    httpParams?: UploadHttpParams;
}
