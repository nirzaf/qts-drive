import { Injectable } from '@angular/core';
import { DriveFolder } from './folders/models/driveFolder';

@Injectable({
    providedIn: 'root'
})
export class DriveUrlsService {
    public driveRoot() {
        return '/drive';
    }

    public folder(folder: DriveFolder) {
        if ( ! folder?.id) {
            return this.driveRoot();
        } else {
            return `/drive/folders/${(folder as DriveFolder).hash}`;
        }
    }
}
