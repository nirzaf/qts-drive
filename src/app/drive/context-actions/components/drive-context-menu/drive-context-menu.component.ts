import { ChangeDetectionStrategy, Component, HostBinding, Inject, Optional, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngxs/store';
import { DriveEntry } from '../../../files/models/drive-entry';
import { CONTEXT_MENU_DATA } from '@common/core/ui/context-menu/context-menu-data';
import { EntryContextMenuOpened } from '../../../state/actions/events';
import { CurrentUser } from '@common/auth/current-user';
import { DeselectAllEntries } from '../../../state/actions/commands';

export interface FileContextMenuData {
    entry: DriveEntry;
}

@Component({
    selector: 'drive-context-menu',
    templateUrl: './drive-context-menu.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class DriveContextMenuComponent {
    @HostBinding('class.context-menu') contextMenu = true;

    constructor(
        @Optional() @Inject(CONTEXT_MENU_DATA) public data: FileContextMenuData,
        protected store: Store,
        protected currentUser: CurrentUser
    ) {
        if (this.data && this.data.entry) {
            this.store.dispatch(new EntryContextMenuOpened(this.data.entry));
        } else {
            this.store.dispatch(new DeselectAllEntries());
        }
    }
}
