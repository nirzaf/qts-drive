import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    Injector,
    Input,
    OnDestroy,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { DriveState } from '../../../state/drive-state';
import { Store } from '@ngxs/store';
import { DriveContextAction } from '../../types/drive-context-action';
import { TrashActions } from '../../actions/trash-actions';
import { SharesActions } from '../../actions/shares-actions';
import { FolderActions } from '../../actions/folder-actions';
import { EntryActions } from '../../actions/entry-actions';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { DRIVE_PAGE_NAMES, DrivePage } from '../../../state/models/drive-page';
import { DriveContextMenuComponent } from '../drive-context-menu/drive-context-menu.component';
import { ContextMenu } from '@common/core/ui/context-menu/context-menu.service';
import { TrashPageActions } from '../../actions/trash-page-actions';
import { DriveEntry } from '../../../files/models/drive-entry';

@Component({
    selector: 'context-actions-container',
    templateUrl: './context-actions-container.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextActionsContainerComponent implements OnDestroy {
    @ViewChild('moreActionsButton', { read: ElementRef }) moreActionsButton: ElementRef;
    @Input() @HostBinding('class.compact') compact = false;

    // whether there are more actions to display in "compact" mode
    public hasMoreActions$ = new BehaviorSubject(false);
    public actions$: BehaviorSubject<DriveContextAction[]> = new BehaviorSubject([]);
    private subscription: Subscription;

    constructor(
        private store: Store,
        private injector: Injector,
        private contextMenu: ContextMenu,
    ) {
        this.subscription = combineLatest([
            this.store.select(DriveState.activePage),
            this.store.select(DriveState.selectedEntry),
        ]).subscribe(combined => {
            this.setActions(combined[0], combined[1]);
            this.hasMoreActions$.next(this.actions$.value.some(action => !action.showInCompact));
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    public openMoreActionsMenu() {
        const entry = this.store.selectSnapshot(DriveState.selectedEntryOrActiveFolder);
        this.contextMenu.open(
            DriveContextMenuComponent,
            this.moreActionsButton.nativeElement,
            {data: {entry}}
        );
    }

    private setActions(activePage: DrivePage, selectedEntry: DriveEntry) {
        // user clicked on "trash" page name in breadcrumb
        if (activePage.name === DRIVE_PAGE_NAMES.TRASH && !selectedEntry) {
            this.actions$.next(this.injector.get(TrashPageActions).getActions());

        // context menu opened for selected entries while in "trash" or "shares" page
        } else if (activePage.name === 'trash' && selectedEntry) {
            this.actions$.next(this.injector.get(TrashActions).getActions());
        } else if (activePage.name === 'shares' && selectedEntry) {
            this.setActionsForEntry();
        // context menu opened by clicking on empty space in folder view or clicking on root folder breadcrumb
        } else if (activePage.folder && !selectedEntry?.id) {
            this.actions$.next(this.injector.get(FolderActions).getActions());

        // show entries context menu for "starred" page
        } else if (activePage.name === 'starred' || activePage.name === 'recent') {
            this.actions$.next(this.injector.get(EntryActions).getActions());

        // default to entry actions if can't match to anything else
        } else if (selectedEntry) {
            this.setActionsForEntry();
        } else {
            this.actions$.next([]);
        }
    }

    private setActionsForEntry() {
        const entries = this.store.selectSnapshot(DriveState.selectedEntries).length
            ? this.store.selectSnapshot(DriveState.selectedEntries)
            : [this.store.selectSnapshot(DriveState.activeFolder)];
        let isOwner = this.store.selectSnapshot(DriveState.selectedEntries).length
            ? this.store.selectSnapshot(DriveState.userOwnsSelectedEntries)
            : this.store.selectSnapshot(DriveState.userOwnsActiveFolder);
        if (this.store.selectSnapshot(DriveState.activeWorkspace)?.id) {
            isOwner = entries.every(e => e.workspace_id === this.store.selectSnapshot(DriveState.activeWorkspace)?.id);
        }
        if (isOwner) {
            this.actions$.next(this.injector.get(EntryActions).getActions());
        } else {
            this.actions$.next(this.injector.get(SharesActions).getActions());
        }
    }
}
