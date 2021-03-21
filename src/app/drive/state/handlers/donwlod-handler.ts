import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { DownloadEntries } from '../actions/commands';
import { DriveState } from '../drive-state';
import { downloadFileFromUrl } from '@common/uploads/utils/download-file-from-url';
import { Settings } from '@common/core/config/settings.service';
import { FileEntry } from '@common/uploads/types/file-entry';
import { Injectable } from '@angular/core';

@Injectable()
export class DownloadHandler {
    constructor(
        private actions$: Actions,
        private store: Store,
        private settings: Settings,
    ) {
        this.actions$.pipe(ofActionSuccessful(DownloadEntries))
            .subscribe((action: DownloadEntries) => {
                downloadFileFromUrl(this.getDownloadUrl(action));
            });
    }

    private getDownloadUrl(action: DownloadEntries): string {
        const hashes = this.getEntryHashes(action.entries);
        let base = `${this.settings.getBaseUrl()}secure/uploads/download?hashes=${hashes}`;
        if (action.link) base += `&shareable_link=${action.link.id}`;
        if (action.password) base += `&password=${action.password}`;
        return base;
    }

    /**
     * Get hashes string for specified entries or for currently selected entries.
     */
    private getEntryHashes(entries?: FileEntry[]): string {
        if ( ! entries) {
            entries = this.store.selectSnapshot(DriveState.selectedEntries);
        }

        return entries.map(entry => entry.hash).join(',');
    }
}
