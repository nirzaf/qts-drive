import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { DriveState } from '../../state/drive-state';
import { DriveEntry } from '../../files/models/drive-entry';
import { Observable, Subscription } from 'rxjs';
import { DrivePageType } from '../../state/models/available-pages';
import { Keybinds } from '@common/core/keybinds/keybinds.service';
import {
    DeleteSelectedEntries,
    DeleteTrashedEntriesForever,
    OpenConfirmDialog,
    SelectAllEntries
} from '../../state/actions/commands';
import { EntryDoubleTapped } from '../../state/actions/events';
import { DRIVE_PAGE_NAMES } from '../../state/models/drive-page';

@Component({
    selector: 'entries-container',
    templateUrl: './entries-container.component.html',
    styleUrls: ['./entries-container.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [Keybinds],
})
export class EntriesContainerComponent implements OnInit, OnDestroy {
    @HostBinding('attr.tabindex') tabindex = 0;
    @Select(DriveState.entries) entries$: Observable<DriveEntry[]>;
    @Select(DriveState.entriesEmpty) noEntries: Observable<boolean>;
    @Select(DriveState.viewMode) viewMode$: Observable<'list'|'grid'>;
    @Select(DriveState.activePageName) activePageName$: Observable<DrivePageType>;
    private keybindSub: Subscription;

    constructor(
        private store: Store,
        private el: ElementRef,
        private keybinds: Keybinds,
    ) {}

    ngOnInit() {
        this.keybindSub = this.keybinds.listenOn(this.el.nativeElement);
        this.keybinds.addWithPreventDefault('ctrl+a', () => {
            this.store.dispatch(new SelectAllEntries());
        });
        this.keybinds.addWithPreventDefault('delete', () => {
            if (this.store.selectSnapshot(DriveState.activePageName) === DRIVE_PAGE_NAMES.TRASH) {
                this.store.dispatch(new OpenConfirmDialog({
                    title: 'Delete Forever',
                    body: 'This will permanently delete selected items.',
                    bodyBold: 'This action can not be undone.',
                    ok: 'Delete Forever',
                }, new DeleteTrashedEntriesForever()));
            } else {
                this.store.dispatch(new DeleteSelectedEntries());
            }
        });
        this.keybinds.addWithPreventDefault('enter', () => {
            this.store.dispatch(new EntryDoubleTapped(this.store.selectSnapshot(DriveState.selectedEntry)));
        });
    }

    ngOnDestroy() {
        this.keybindSub.unsubscribe();
    }
}
