import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { DriveEntryApiService } from '../../drive-entry-api.service';
import { Store } from '@ngxs/store';
import { DriveState } from '../../state/drive-state';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { Translations } from '@common/core/translations/translations.service';
import {
    ContextMenu, ContextMenuParams
} from '@common/core/ui/context-menu/context-menu.service';
import { DriveContextMenuComponent } from '../../context-actions/components/drive-context-menu/drive-context-menu.component';
import { distinctUntilChanged, filter, take } from 'rxjs/operators';
import { OpenFolder } from '../../state/actions/commands';
import {
    DRIVE_PAGE_NAMES, DrivePage, FolderPage, SHARES_PAGE,
} from '../../state/models/drive-page';
import { Navigate } from '@ngxs/router-plugin';
import { DriveFolder } from '../../folders/models/driveFolder';
import { SKELETON_ANIMATIONS } from '../../../../common/core/ui/skeleton/skeleton-animations';
import { WorkspacesService } from '../../../../common/workspaces/workspaces.service';

@Component({
    selector: 'entry-breadcrumbs',
    templateUrl: './entry-breadcrumbs.component.html',
    styleUrls: ['./entry-breadcrumbs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [SKELETON_ANIMATIONS],
})
export class EntryBreadcrumbsComponent implements OnInit, OnDestroy {
    public breadcrumb: BehaviorSubject<DrivePage[]> = new BehaviorSubject([]);
    public loading$ = new BehaviorSubject<boolean>(true);
    private activePageSub: Subscription;

    constructor(
        private entriesApi: DriveEntryApiService,
        private i18n: Translations,
        private contextMenu: ContextMenu,
        private store: Store,
        private workspaces: WorkspacesService,
    ) {}

    ngOnInit() {
        // wait until entries and user folders are loaded
        combineLatest([
            this.store.select(DriveState.meta),
            this.store.select(DriveState.userFoldersLoaded),
            this.workspaces.activeWorkspace$,
        ]).pipe(
            filter(([meta, foldersLoaded, workspace]) => meta.currentPage && foldersLoaded && !!workspace),
            take(1)
        ).subscribe(() => {
            this.loading$.next(false);
            this.bindToActivePage();
        });
    }

    ngOnDestroy() {
        this.activePageSub && this.activePageSub.unsubscribe();
    }

    public openPage(page: DrivePage) {
        if (page.folder) {
            this.store.dispatch(new OpenFolder(page.folder));
        } else {
            this.store.dispatch(new Navigate(['/drive/shares']));
        }
    }

    public openContextMenu(item: DrivePage, origin: HTMLElement) {
        let params = {originX: 'start', overlayX: 'start'} as ContextMenuParams;
        switch (item.name) {
            case DRIVE_PAGE_NAMES.TRASH:
                return this.contextMenu.open(DriveContextMenuComponent, origin, params);
            case DRIVE_PAGE_NAMES.FOLDER:
                params = {data: {entry: this.store.selectSnapshot(DriveState.activeFolder)}, ...params};
                return this.contextMenu.open(DriveContextMenuComponent, origin, params);
        }
    }

    private generateBreadCrumb(page: DrivePage) {
        const breadcrumbs = [this.getRootBreadcrumb(page)];

        if (page.folder?.id) {
            const folderPath = this.getBreadcrumbForFolder(page.folder);
            breadcrumbs.push(...folderPath);
        }
        this.breadcrumb.next(breadcrumbs);
    }

    private getBreadcrumbForFolder(folder: DriveFolder) {
        const allFolders = this.store.selectSnapshot(DriveState.flatFolders) || [];
        const ids = (folder.path ? folder.path.split('/') : [folder.id]) as number[];
        return ids.map(id => {
            const pathFolder = folder.id === +id ? folder : allFolders.find(f => f.id === +id);
            if (pathFolder) {
                return new FolderPage(pathFolder);
            }
        }).filter(f => !!f);
    }

    private getRootBreadcrumb(page: DrivePage) {
        if (page.name === DRIVE_PAGE_NAMES.FOLDER) {
            const workspaceId = this.workspaces.activeId$.value;
            const ROOT_FOLDER_PAGE = new FolderPage(this.store.selectSnapshot(DriveState.rootFolder));
            if (workspaceId && page.folder.workspace_id === workspaceId) {
                return {...ROOT_FOLDER_PAGE, viewName: this.workspaces.activeWorkspace$.value.name};
            } else {
                return !this.store.selectSnapshot(DriveState.userOwnsActiveFolder) ? SHARES_PAGE : ROOT_FOLDER_PAGE;
            }
        } else {
            return page;
        }
    }

    private bindToActivePage() {
        this.activePageSub = combineLatest([
            this.store.select(DriveState.activePage),
            this.store.select(DriveState.flatFolders),
        ]).pipe(
            distinctUntilChanged(),
            filter(([activePage]) => {
                // wait until folder data is fully loaded
                return activePage.name === DRIVE_PAGE_NAMES.FOLDER ? activePage.folder?.name : true;
            })
        ).subscribe(([activePage]) => {
            this.generateBreadCrumb(activePage);
        });
    }
}
