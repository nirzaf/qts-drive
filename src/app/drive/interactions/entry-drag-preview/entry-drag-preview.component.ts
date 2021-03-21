import { Component, ViewEncapsulation, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { DriveState } from '../../state/drive-state';
import { Observable } from 'rxjs';
import { DriveEntry } from '../../files/models/drive-entry';

@Component({
    selector: 'entry-drag-preview',
    templateUrl: './entry-drag-preview.component.html',
    styleUrls: ['./entry-drag-preview.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryDragPreviewComponent {
    @Select(DriveState.selectedEntries) entries: Observable<DriveEntry[]>;
    @HostBinding('class') className = 'files-grid-item-footer';
    @HostBinding('class.hidden') get dragging() {
        return !this.store.selectSnapshot(DriveState.dragging);
    }

    constructor(private store: Store) {}
}
