import {PaginationResponse} from './pagination-response';
import {BackendResponse} from '../backend-response';

export type PaginatedBackendResponse<T> = BackendResponse<{pagination: PaginationResponse<T>}>;
