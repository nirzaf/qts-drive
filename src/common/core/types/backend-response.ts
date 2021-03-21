import {Observable} from 'rxjs';
import { MetaTag } from '../meta/meta-tags.service';

export type GenericBackendResponse<T extends {}> = T & {
    status?: string,
    seo?: MetaTag[],
};

export interface BackendResponse<T> extends Observable<GenericBackendResponse<T>> {}
