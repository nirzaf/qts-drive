import { Directive, ElementRef, Input } from '@angular/core';
import { BaseDropTarget } from './base-drop-target';
import { DriveState} from '../../state/drive-state';
import { Store } from '@ngxs/store';
import { DriveFolder } from '../../folders/models/driveFolder';
import { MoveEntries } from '../../state/actions/commands';

@Directive({
    selector: '[folderDropTarget]'
})
export class FolderDropTargetDirective extends BaseDropTarget {
    @Input('folderDropTarget') folder: DriveFolder;

    constructor(
        protected el: ElementRef,
        protected store: Store,
    ) {
      super();
    }

    protected canDrop(): boolean {
        const entries = this.store.selectSnapshot(DriveState.selectedEntries),
            folder = this.folder as DriveFolder;

        return DriveState.canMoveEntriesTo(entries, folder);
    }

    protected executeAction() {
        return this.store.dispatch(new MoveEntries(this.folder));
    }
}
