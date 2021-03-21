import { Injectable } from '@angular/core';
import { AppHttpClient } from '@common/core/http/app-http-client.service';
import { DriveEntry } from './files/models/drive-entry';
import { BackendResponse } from '@common/core/types/backend-response';
import { DriveFolder } from './folders/models/driveFolder';
import { Observable } from 'rxjs';
import { CurrentUser } from '@common/auth/current-user';
import { Tag } from '@common/core/types/models/Tag';
import { SortColumn, SortDirection } from './entries/available-sorts';
import { UserSpaceUsage } from './state/models/user-space-usage';
import { PaginationResponse } from '@common/core/types/pagination/pagination-response';

export interface DriveApiIndexParams {
    orderBy?: SortColumn;
    orderDir?: SortDirection;
    folderId?: number;
    userId?: number;
    query?: string;
    type?: string;
    deletedOnly?: boolean;
    starredOnly?: boolean;
    sharedOnly?: boolean;
    per_page?: number;
    page?: number;
    recentOnly?: boolean;
}

export interface DriveEntriesPaginationResponse extends PaginationResponse<DriveFolder> {
    folder: DriveFolder;
}

@Injectable({
    providedIn: 'root'
})
export class DriveEntryApiService {
    constructor(private http: AppHttpClient, private currentUser: CurrentUser) {}

    public getEntriesForFolder(params: DriveApiIndexParams = {}): Observable<DriveEntriesPaginationResponse> {
        return this.http.get('drive/entries', params);
    }

    public getCurrentUserEntries(params: DriveApiIndexParams): Observable<DriveEntriesPaginationResponse> {
        params.userId = this.currentUser.get('id');
        return this.http.get('drive/entries', params);
    }

    public update(entryId: number, params: {name?: string, description?: string}): BackendResponse<{fileEntry: DriveEntry}> {
        return this.http.put('uploads/' + entryId, params);
    }

    public delete(params: {entryIds?: number[], deleteForever?: boolean, emptyTrash?: boolean}): BackendResponse<void> {
        return this.http.delete('drive/entries', params);
    }

    public copy(params: {entryIds: number[]}): BackendResponse<{entries: DriveEntry[]}> {
        return this.http.post('drive/entries/copy', params);
    }

    public restore(params: {entryIds: number[]}): BackendResponse<void> {
        return this.http.post('drive/entries/restore', params);
    }

    public emptyTrash(): BackendResponse<void> {
        return this.delete({emptyTrash: true});
    }

    public moveEntries(params: {entryIds: number[], destination: number}): BackendResponse<{entries: DriveEntry[]}> {
        return this.http.post('drive/entries/move', params);
    }

    public addStar(entryIds: number[]): BackendResponse<{tag: Tag}> {
        return this.http.post('drive/entries/star', {entryIds});
    }

    public removeStar(entryIds: number[]): BackendResponse<{tag: Tag}> {
        return this.http.post('drive/entries/unstar', {entryIds});
    }

    public getSpaceUsage(): BackendResponse<UserSpaceUsage> {
        return this.http.get('drive/user/space-usage');
    }
}
