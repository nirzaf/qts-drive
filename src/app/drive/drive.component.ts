import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { DriveState } from './state/drive-state';
import { DriveDomCacheService } from './interactions/drive-dom-cache.service';
import { EntryDragPreviewComponent } from './interactions/entry-drag-preview/entry-drag-preview.component';
import { Observable, Subscription } from 'rxjs';
import {
    LoadUserFolders,
    LoadUserSpaceUsage,
    ReloadPageEntries,
    ResetState,
    SetCurrentUser,
    SetViewMode,
    SetWorkspace,
    ToggleSidebar,
    UploadFiles
} from './state/actions/commands';
import { UploadedFile } from '@common/uploads/uploaded-file';
import { Settings } from '@common/core/config/settings.service';
import { CurrentUser } from '@common/auth/current-user';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BreakpointChanged, UserSpaceUsageChanged } from './state/actions/events';
import { VIEW_MODE_KEY } from './state/models/drive-state-model';
import { LocalStorage } from '@common/core/services/local-storage.service';
import { User } from '@common/core/types/models/User';
import { WorkspacesService } from '../../common/workspaces/workspaces.service';
import { filter, skip } from 'rxjs/operators';
import { DrivePage, FolderPage } from './state/models/drive-page';
import { EntryActions } from './context-actions/actions/entry-actions';
import { FolderActions } from './context-actions/actions/folder-actions';
import { SharesActions } from './context-actions/actions/shares-actions';
import { TrashActions } from './context-actions/actions/trash-actions';
import { TrashPageActions } from './context-actions/actions/trash-page-actions';
import { ContextMenu } from '../../common/core/ui/context-menu/context-menu.service';

const actions = [EntryActions, FolderActions, SharesActions, TrashActions, TrashPageActions];

@Component({
    selector: 'drive',
    templateUrl: './drive.component.html',
    styleUrls: ['./drive.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,

    // scope workspaces to drive component and make sure context menus get correct instance
    providers: [...actions, ContextMenu, WorkspacesService],
})
export class DriveComponent implements OnInit, OnDestroy {
    @ViewChild('scrollContainer', { read: ElementRef, static: true }) scrollContainer: ElementRef;
    @ViewChild('filesContainer', { static: true }) filesContainer: ElementRef;
    @ViewChild(EntryDragPreviewComponent, { read: ElementRef, static: true }) dragPreview: ElementRef;
    @Select(DriveState.dragging) dragging: Observable<boolean>;
    @Select(DriveState.detailsOpen) activityOpen$: Observable<boolean>;
    @Select(DriveState.sidebarOpen) sidebarOpen$: Observable<boolean>;
    @Select(DriveState.loading) loading$: Observable<boolean>;
    @Select(DriveState.isMobile) isMobile$: Observable<boolean>;
    @Select(DriveState.canUpload) canUpload$: Observable<boolean>;
    @Select(DriveState.activePage) activePage$: Observable<DrivePage>;

    private subscriptions: Subscription[] = [];

    constructor(
        private store: Store,
        private route: ActivatedRoute,
        private currentUser: CurrentUser,
        private localStorage: LocalStorage,
        private domCache: DriveDomCacheService,
        private breakpoints: BreakpointObserver,
        private workspaces: WorkspacesService,
        public settings: Settings,
    ) {}

    ngOnInit() {
        this.setViewMode();
        this.cacheDemoElements();
        this.observeBreakpointChanges();
        this.bindToWorkspace();
        this.store.dispatch(new LoadUserFolders());
        this.store.dispatch(new LoadUserSpaceUsage());

        // TODO: refactor this once auth is moved to it's own store
        this.store.dispatch(new SetCurrentUser(this.currentUser.getModel() as User));
        this.currentUser.model$.subscribe(user => {
            this.store.dispatch(new SetCurrentUser(user as User));
        });
    }

    ngOnDestroy() {
        this.store.dispatch(ResetState);
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }

    public uploadFiles(files: UploadedFile[]) {
        this.store.dispatch(new UploadFiles(files));
    }

    public toggleSidebar() {
        this.store.dispatch(new ToggleSidebar());
    }

    private cacheDemoElements() {
        this.domCache.filesCont = this.filesContainer.nativeElement;
        this.domCache.scrollCont = this.scrollContainer.nativeElement;
        this.domCache.dragPreview = this.dragPreview.nativeElement;
    }

    private setViewMode() {
        this.store.dispatch(new SetViewMode(
            this.localStorage.get(VIEW_MODE_KEY, this.settings.get('drive.default_view', 'grid')))
        );
    }

    private observeBreakpointChanges() {
        const sub = this.breakpoints.observe('(max-width: 1100px)').subscribe(result => {
            this.store.dispatch(new BreakpointChanged({isMobile: result.matches}));
        });
        this.subscriptions.push(sub);
    }

    private bindToWorkspace() {
        // skip initially selected workspace
        const sub1 = this.workspaces.activeId$.pipe(skip(1)).subscribe(() => {
            this.store.dispatch([
                new ReloadPageEntries({}, new FolderPage(this.store.selectSnapshot(DriveState.rootFolder))),
                new UserSpaceUsageChanged(),
                new LoadUserFolders()
            ]);
        });
        const sub3 = this.workspaces.activeWorkspace$.pipe(filter(w => !!w))
            .subscribe(workspace => {
                this.store.dispatch(new SetWorkspace(workspace));
            });
        const sub2 = this.workspaces.bindToNotificationClick();
        this.subscriptions.push(sub1, sub2, sub3);
    }
}
