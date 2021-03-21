import { Injectable } from '@angular/core';
import { AppHttpClient } from '@common/core/http/app-http-client.service';
import { DriveEntryUser } from '../files/models/drive-entry';
import { DriveEntryPermissions } from '../permissions/drive-entry-permissions';
import { BackendResponse } from '@common/core/types/backend-response';
import { FileEntry } from '@common/uploads/types/file-entry';

export interface DriveEntryApiParams {
    entries: FileEntry[];
    emails: string[];
    permissions: DriveEntryPermissions;
}

@Injectable({
    providedIn: 'root'
})
export class SharesApiService {
    constructor(private http: AppHttpClient) {}

    public changePermissions(userId: number, entryIds: number[], permissions: DriveEntryPermissions): BackendResponse<{users: DriveEntryUser[]}> {
        return this.http.put(`drive/shares/change-permissions/${userId}`, {permissions, entryIds});
    }

    /**
     * Attach specified users to entries.
     */
    public shareEntries(params: DriveEntryApiParams): BackendResponse<{users: DriveEntryUser[]}> {
        return this.http.post('drive/shares/add-users', {
            ...params,
            entryIds: params.entries.map(entry => entry.id)
        });
    }

    /**
     * Detach specified user from entries.
     */
    public detachUser(userId: number, entryIds: number[]): BackendResponse<{users: DriveEntryUser[]}> {
        return this.http.post('drive/shares/remove-user/' + userId, {entryIds});
    }
}
