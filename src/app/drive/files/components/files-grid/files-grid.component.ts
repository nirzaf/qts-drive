import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';
import { DriveEntry } from '../../models/drive-entry';

@Component({
    selector: 'files-grid',
    templateUrl: './files-grid.component.html',
    styleUrls: ['./files-grid.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilesGridComponent {
    @Input() entries: DriveEntry[];
    @Input() disableInteractions = false;
    public trackById(index: number, entry: DriveEntry): number {
        return entry.id;
    }
}
