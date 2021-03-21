import { Injectable } from '@angular/core';
import { AppHttpClient } from '../../core/http/app-http-client.service';
import { PaginatedBackendResponse } from '../../core/types/pagination/paginated-backend-response';
import { BackendResponse } from '@common/core/types/backend-response';
import { Plan } from '@common/core/types/models/Plan';
import { PaginationParams } from '@common/core/types/pagination/pagination-params';

@Injectable({
    providedIn: 'root'
})
export class Plans {
    static BASE_URI = 'billing-plan';
    constructor(private http: AppHttpClient) {}

    public all(params?: PaginationParams): PaginatedBackendResponse<Plan> {
        return this.http.get(Plans.BASE_URI, params);
    }

    public get(id: number): BackendResponse<{plan: Plan}> {
        return this.http.get(`${Plans.BASE_URI}/${id}`);
    }

    public create(params: object): BackendResponse<{plan: Plan}> {
        return this.http.post(Plans.BASE_URI, params);
    }

    public update(id: number, params: object): BackendResponse<{plan: Plan}> {
        return this.http.put(`${Plans.BASE_URI}/${id}`, params);
    }

    public delete(ids: number[]): BackendResponse<void> {
        return this.http.delete(`${Plans.BASE_URI}/${ids}`);
    }

    public sync(): BackendResponse<void> {
        return this.http.post(`${Plans.BASE_URI}/sync`);
    }
}
