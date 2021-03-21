import { Component, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { DriveState } from '../../state/drive-state';
import { Observable } from 'rxjs';
import { ContextMenu } from '@common/core/ui/context-menu/context-menu.service';
import { DriveContextMenuComponent } from '../../context-actions/components/drive-context-menu/drive-context-menu.component';
import { ToggleDetailsSidebar, SetViewMode } from '../../state/actions/commands';

@Component({
    selector: 'toolbar-actions',
    templateUrl: './toolbar-actions.component.html',
    styleUrls: ['./toolbar-actions.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarActionsComponent {
    @ViewChild('moreActionsButton', { read: ElementRef }) moreActionsButton: ElementRef;
    @Select(DriveState.anythingSelected) anythingSelected: Observable<boolean>;
    @Select(DriveState.viewMode) viewMode: Observable<'list'|'grid'>;
    @Select(DriveState.detailsOpen) activityOpen: Observable<boolean>;
    @Select(DriveState.multipleEntriesSelected) multipleEntriesSelected$: Observable<boolean>;

    constructor(
        protected store: Store,
        protected contextMenu: ContextMenu,
    ) {}

    public toggleViewMode() {
        const current = this.store.selectSnapshot(DriveState.viewMode);
        this.store.dispatch(new SetViewMode(current === 'list' ? 'grid' : 'list'));
    }

    public ToggleDetails() {
        this.store.dispatch(new ToggleDetailsSidebar());
    }

    public openMoreActionsMenu() {
        const entry = this.store.selectSnapshot(DriveState.selectedEntry);
        this.contextMenu.open(
            DriveContextMenuComponent,
            this.moreActionsButton.nativeElement,
            {data: {entry}}
        );
    }
}
