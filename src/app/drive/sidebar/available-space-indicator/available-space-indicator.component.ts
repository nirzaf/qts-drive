import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { DriveState } from '../../state/drive-state';
import { Observable } from 'rxjs';
import { Settings } from '@common/core/config/settings.service';
import { SKELETON_ANIMATIONS } from '../../../../common/core/ui/skeleton/skeleton-animations';
import { WorkspacesService } from '../../../../common/workspaces/workspaces.service';

@Component({
    selector: 'available-space-indicator',
    templateUrl: './available-space-indicator.component.html',
    styleUrls: ['./available-space-indicator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [SKELETON_ANIMATIONS],
})
export class AvailableSpaceIndicatorComponent {
    @Select(DriveState.userSpaceUsed) spaceUsed$: Observable<number>;
    @Select(DriveState.userSpaceAvailable) spaceAvailable$: Observable<number>;
    @Select(DriveState.spaceUsedPercent) spaceUsedPercent$: Observable<number>;

    constructor(public settings: Settings, public workspaces: WorkspacesService) {}
}
