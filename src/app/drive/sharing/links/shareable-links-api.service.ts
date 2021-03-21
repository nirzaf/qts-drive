import { Injectable } from '@angular/core';
import { BackendResponse } from '@common/core/types/backend-response';
import { ShareableLink } from './models/shareable-link';
import { AppHttpClient } from '@common/core/http/app-http-client.service';
import { ShareableLinkOptions } from './models/shareable-link-options';
import { User } from '@common/core/types/models/User';
import { PaginationResponse } from '@common/core/types/pagination/pagination-response';
import { FileEntry } from '@common/uploads/types/file-entry';

export interface GetLinkData {
    link: ShareableLink;
    folderChildren: PaginationResponse<FileEntry>;
}

@Injectable({
    providedIn: 'root'
})
export class ShareableLinksApiService {
    constructor(private http: AppHttpClient) {}

    public findByEntryId(entryId: number, params: {autoCreate?: boolean}): BackendResponse<{ link: ShareableLink }> {
        return this.http.get(`drive/entries/${entryId}/shareable-link`, params);
    }

    public findByHash(hash: string, params?: {withEntries?: boolean, page?: number, order?: string}): BackendResponse<GetLinkData> {
        return this.http.get(`drive/shareable-links/${hash}`, params);
    }

    public create(entryId: number, params: Partial<ShareableLinkOptions>): BackendResponse<{ link: ShareableLink }> {
        return this.http.post(`drive/entries/${entryId}/shareable-link`, params);
    }

    public update(id: number, params: Partial<ShareableLinkOptions>): BackendResponse<{ link: ShareableLink }> {
        return this.http.put(`drive/shareable-links/${id}`, params);
    }

    public delete(id: number): BackendResponse<void> {
        return this.http.delete(`drive/shareable-links/${id})`);
    }

    public checkPassword(linkId: number, password: string): BackendResponse<{matches: boolean}> {
        return this.http.post(`drive/shareable-links/${linkId}/check-password`, {password});
    }

    /**
     * Import shareable link entry into current user's drive.
     */
    public importEntry(linkId: number, password?: string): BackendResponse<{users: User[]}> {
        return this.http.post(`drive/shareable-links/${linkId}/import`, {password});
    }
}
