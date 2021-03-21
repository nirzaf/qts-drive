import {Injectable} from '@angular/core';
import {HttpCacheClient} from '../../core/http/http-cache-client';
import {CustomPage} from '../../core/types/models/CustomPage';
import {BackendResponse} from '../../core/types/backend-response';
import {PaginatedBackendResponse} from '../../core/types/pagination/paginated-backend-response';
import {PaginationParams} from '../../core/types/pagination/pagination-params';

@Injectable({
    providedIn: 'root',
})
export class Pages {
    static BASE_URI = 'page';
    constructor(private http: HttpCacheClient) {}

    public getAll(params: PaginationParams = {}): PaginatedBackendResponse<CustomPage> {
        return this.http.getWithCache(`${Pages.BASE_URI}`, params);
    }

    public get(id: number): BackendResponse<{page: CustomPage}> {
        return this.http.getWithCache(`${Pages.BASE_URI}/${id}`);
    }

    public create(params: Partial<CustomPage>, endpoint?: string): BackendResponse<{page: CustomPage}> {
        return this.http.post(`${endpoint || Pages.BASE_URI}`, params);
    }

    public update(id: number, params: Partial<CustomPage>, endpoint?: string): BackendResponse<{page: CustomPage}> {
        return this.http.put(`${endpoint || Pages.BASE_URI}/${id}`, params);
    }

    public delete(ids: number[]) {
        return this.http.delete(`${Pages.BASE_URI}/${ids}`);
    }
}
