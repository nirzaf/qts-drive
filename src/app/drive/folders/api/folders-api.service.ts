import {Injectable} from '@angular/core';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {FOLDERS_API_ROUTES} from './folders-api-routes.enum';
import {DriveFolder} from '../models/driveFolder';
import {CurrentUser} from '@common/auth/current-user';
import { BackendResponse } from '@common/core/types/backend-response';
import { PaginatedBackendResponse } from '@common/core/types/pagination/paginated-backend-response';

@Injectable({
    providedIn: 'root'
})
export class FoldersApiService {

    constructor(
        private http: AppHttpClient,
        private currentUser: CurrentUser
    ) {}

    public getAll(params?: {userId?: number}): PaginatedBackendResponse<DriveFolder> {
        return this.http.get(FOLDERS_API_ROUTES.GET_ALL, params);
    }

    public getAllForCurrentUser(): BackendResponse<{folders: DriveFolder[], rootFolder: DriveFolder}> {
        return this.http.get('drive/users/' + this.currentUser.get('id') + '/folders');
    }

    public create(params: {name: string, parentId: number|null}): BackendResponse<{folder: DriveFolder}> {
        return this.http.post(FOLDERS_API_ROUTES.CREATE, params);
    }

    public getByHash(hash: string): BackendResponse<{folder: DriveFolder}> {
        return this.http.get('drive/folders/find', {hash});
    }
}
