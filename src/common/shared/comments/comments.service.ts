import {Injectable} from '@angular/core';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {PaginatedBackendResponse} from '@common/core/types/pagination/paginated-backend-response';
import {BackendResponse} from '@common/core/types/backend-response';
import {PaginationParams} from '@common/core/types/pagination/pagination-params';
import {Comment} from '@common/shared/comments/comment';

const BASE_URI = 'comment';

@Injectable({
    providedIn: 'root'
})
export class CommentsService {
    constructor(private http: AppHttpClient) {}

    public all(params?: PaginationParams): PaginatedBackendResponse<Comment> {
        return this.http.get(BASE_URI, params);
    }

    public get(id: number): BackendResponse<{comment: Comment}> {
        return this.http.get(`${BASE_URI}/${id}`);
    }

    public create<T = Comment>(params: Partial<T> & {inReplyTo?: T}): BackendResponse<{comment: T}> {
        return this.http.post(BASE_URI, params);
    }

    public update(id: number, params: object): BackendResponse<{comment: Comment}> {
        return this.http.put(`${BASE_URI}/${id}`, params);
    }

    public delete(params: {ids: number[]}): BackendResponse<void> {
        return this.http.delete(`${BASE_URI}/${params.ids}`);
    }
}
