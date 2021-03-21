import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';
import { DriveEntry } from '../../../models/drive-entry';

@Component({
    selector: 'files-grid-item',
    templateUrl: './files-grid-item.component.html',
    styleUrls: ['./files-grid-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilesGridItemComponent {
    @HostBinding('class.drive-entry') driveEntry = true;
    @Input() entry: DriveEntry;

    @HostBinding('attr.data-id') get fileId() {
        return this.entry.id;
    }
}
