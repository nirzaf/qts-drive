import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { DriveState} from '../state/drive-state';
import { Observable } from 'rxjs';
import { DriveEntry } from '../files/models/drive-entry';
import { ToggleDetailsSidebar } from '../state/actions/commands';
import { DrivePage } from '../state/models/drive-page';

@Component({
    selector: 'details-sidebar',
    templateUrl: './details-sidebar.component.html',
    styleUrls: ['./details-sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsSidebarComponent {
    @Select(DriveState.selectedEntryOrActiveFolder) entry$: Observable<DriveEntry>;
    @Select(DriveState.activePage) activePage$: Observable<DrivePage>;

    constructor(private store: Store) {}

    public close() {
        this.store.dispatch(new ToggleDetailsSidebar());
    }
}
