import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { DriveState } from '../../state/drive-state';
import { Observable } from 'rxjs';
import { DriveEntry } from '../../files/models/drive-entry';
import { OpenFolder } from '../../state/actions/commands';
import { DriveFolder } from '../../folders/models/driveFolder';
import { WorkspacesService } from '../../../../common/workspaces/workspaces.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'details-panel',
    templateUrl: './details-panel.component.html',
    styleUrls: ['./details-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsPanelComponent {
    @Select(DriveState.selectedEntryOrActiveFolder) entry$: Observable<DriveEntry>;
    @Select(DriveState.selectedEntryParent) parent$: Observable<DriveFolder>;
    public owner$ = this.store.select(DriveState.selectedEntryOrActiveFolder)
        .pipe(map(entry => entry.users.find(u => u.owns_entry)));

    constructor(
        private store: Store,
        public workspaces: WorkspacesService,
    ) {}

    public openLocation() {
        const parent = this.store.selectSnapshot(DriveState.selectedEntryParent);
        this.store.dispatch(new OpenFolder(parent));
    }
}
