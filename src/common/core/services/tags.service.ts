import {Injectable} from '@angular/core';
import {AppHttpClient} from '../../core/http/app-http-client.service';
import {PaginatedBackendResponse} from '../../core/types/pagination/paginated-backend-response';
import {Tag} from '@common/core/types/models/Tag';
import {BackendResponse} from '@common/core/types/backend-response';

@Injectable({
    providedIn: 'root'
})
export class TagsService {
    static BASE_URI = 'tags';

    constructor(private http: AppHttpClient) {
    }

    public index(params?: object): PaginatedBackendResponse<Tag> {
        return this.http.get(TagsService.BASE_URI, params);
    }

    public create(params: Partial<Tag>): BackendResponse<{tag: Tag}> {
        return this.http.post(TagsService.BASE_URI, params);
    }

    public update(id: number, params: Partial<Tag>): BackendResponse<{tag: Tag}> {
        return this.http.put(`${TagsService.BASE_URI}/${id}`, params);
    }

    public delete(tagIds: number[]): BackendResponse<void> {
        return this.http.delete(`${TagsService.BASE_URI}/${tagIds}`);
    }

}
