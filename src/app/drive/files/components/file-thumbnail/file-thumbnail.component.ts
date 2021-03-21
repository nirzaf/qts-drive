import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { DriveEntry } from '../../models/drive-entry';

@Component({
    selector: 'file-thumbnail',
    templateUrl: './file-thumbnail.component.html',
    styleUrls: ['./file-thumbnail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileThumbnailComponent {
    @Input() file: DriveEntry;

    public getPreviewUrl(): string {
        let url = this.file.url;
        if (this.file.thumbnail) {
            const separator = url.includes('?') ? '&' : '?';
            url += separator + 'thumbnail=true';
        }
        return url;
    }

    public getFolderIcon() {
        if (this.file.users && this.file.users.length > 1) {
            return 'shared-folder';
        } else {
            return 'folder';
        }
    }
}
