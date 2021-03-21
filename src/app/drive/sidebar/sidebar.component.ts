import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { DriveUrlsService } from '../drive-urls.service';
import { DriveState } from '../state/drive-state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { OpenFolder } from '../state/actions/commands';
import { DrivePage } from '../state/models/drive-page';
import { DriveFolder } from '../folders/models/driveFolder';

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
    @Select(DriveState.activePage) activePage$: Observable<DrivePage>;
    @Select(DriveState.rootFolder) rootFolder$: Observable<DriveFolder>;

    constructor(
        public urls: DriveUrlsService,
        private store: Store
    ) {}

    public openFolder(folder: DriveFolder) {
        this.store.dispatch(new OpenFolder(folder));
    }
}
