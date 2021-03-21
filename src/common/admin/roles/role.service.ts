import {Injectable} from '@angular/core';
import {HttpCacheClient} from '../../core/http/http-cache-client';
import {Observable} from 'rxjs';
import {Role} from '../../core/types/models/Role';
import {PaginatedBackendResponse} from '../../core/types/pagination/paginated-backend-response';

@Injectable({
    providedIn: 'root',
})
export class RoleService {
    constructor(private httpClient: HttpCacheClient) {}

    public getRoles(): PaginatedBackendResponse<Role> {
        return this.httpClient.getWithCache('roles?perPage=15');
    }

    public createNew(data): Observable<Role> {
        return this.httpClient.post('roles', data);
    }

    public update(roleId, data): Observable<Role> {
        return this.httpClient.put('roles/' + roleId, data);
    }

    public delete(roleId: number): Observable<any> {
        return this.httpClient.delete('roles/' + roleId);
    }

    public addUsers(roleId: number, emails: string[]): Observable<Role> {
        return this.httpClient.post('roles/' + roleId + '/add-users', {emails});
    }

    public removeUsers(roleId: number, userIds: number[]): Observable<Role> {
        return this.httpClient.post('roles/' + roleId + '/remove-users', {ids: userIds});
    }
}
