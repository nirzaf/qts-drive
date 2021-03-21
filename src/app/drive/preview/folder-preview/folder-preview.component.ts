import {
    Component, ViewEncapsulation, ChangeDetectionStrategy, Input, ViewChild, ElementRef, OnInit, OnChanges, NgZone,
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { DownloadEntries, SetViewMode } from '../../state/actions/commands';
import { BehaviorSubject, Observable } from 'rxjs';
import { FilePreviewOverlayComponent } from '../file-preview-overlay/file-preview-overlay.component';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { GetLinkData, ShareableLinksApiService } from '../../sharing/links/shareable-links-api.service';
import { finalize } from 'rxjs/operators';
import { SortValue } from '../../entries/available-sorts';
import { InfiniteScroll } from '@common/core/ui/infinite-scroll/infinite.scroll';
import { PaginationResponse } from '@common/core/types/pagination/pagination-response';
import { FileEntry } from '@common/uploads/types/file-entry';
import { OverlayPanel } from '@common/core/ui/overlay-panel/overlay-panel.service';
import { DriveState } from '../../state/drive-state';

@Component({
    selector: 'folder-preview',
    templateUrl: './folder-preview.component.html',
    styleUrls: ['./folder-preview.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FolderPreviewComponent extends InfiniteScroll implements OnChanges, OnInit {
    @Input() data: GetLinkData;
    @Input() password: string;
    @ViewChild('filesContainer', { static: true }) filesContainer: ElementRef<HTMLDivElement>;
    @Select(DriveState.viewMode) viewMode$: Observable<'list'|'grid'>;

    get folder() {
        return this.data.link.entry;
    }

    get children() {
        return this.pagination$.value.data;
    }

    public loading$ = new BehaviorSubject(false);
    public breadcrumb$: BehaviorSubject<FileEntry[]> = new BehaviorSubject([]);
    public pagination$: BehaviorSubject<PaginationResponse<FileEntry>> = new BehaviorSubject(null);
    private allFolders = {};
    public sortFormControl = new FormControl({
        column: 'updated_at',
        direction: 'desc',
    });

    constructor(
        private store: Store,
        private overlay: OverlayPanel,
        private router: Router,
        private linkApi: ShareableLinksApiService,
        protected zone: NgZone,
        protected el: ElementRef,
    ) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.sortFormControl.valueChanges.subscribe((value: SortValue) => {
            if (value) {
                this.loadChildren({}, true);
            }
        });
    }

    ngOnChanges() {
        this.allFolders[this.folder.id] = this.folder;
        this.generateBreadcrumb(this.folder);
        this.setPagination(this.data.folderChildren);
        this.loading$.next(false);
    }

    public download() {
        this.store.dispatch(new DownloadEntries([this.folder], this.data.link, this.password));
    }

    public toggleViewMode() {
        const current = this.store.selectSnapshot(DriveState.viewMode);
        this.store.dispatch(new SetViewMode(current === 'list' ? 'grid' : 'list'));
    }

    private openPreviewOverlay(entry: FileEntry) {
        const entries = this.children.filter(ent => ent.type !== 'folder'),
            activeEntry = entries.findIndex(e => e.id === entry.id);

        this.overlay.open(FilePreviewOverlayComponent, {
            position: 'center',
            origin: 'global',
            panelClass: 'file-preview-overlay-container',
            data: {
                entries: entries.slice(),
                activeEntry,
                shareableLink: this.data.link,
                password: this.password,
                hideMoreOptionsBtn: true,
            }
        });
    }

    private getEntry(e: MouseEvent): FileEntry {
        const node = (e.target as HTMLElement).closest('.drive-entry') as HTMLElement;
        if (node) {
            return this.children.find(entry => entry.id === +node.dataset.id);
        }
    }

    public onClick(e: MouseEvent) {
        const entry = this.getEntry(e);
        if ( ! entry) return;

        if (entry.type === 'folder') {
            this.openFolder(entry);
        } else {
            this.openPreviewOverlay(entry);
        }
    }

    public isSubFolder() {
        return this.router.url.indexOf(':') > -1;
    }

    public openFolder(folder?: FileEntry) {
        if (folder && this.folder.id === folder.id) return;
        this.loading$.next(true);
        this.router.navigate(['/drive/s', this.makeLinkHash(folder)]).then(() => {
            // reset sort to default, as there's no good way to
            // pass current sort to parent link preview component
            this.sortFormControl.reset();
        });
    }

    private generateBreadcrumb(folder: FileEntry) {
        this.breadcrumb$.next(folder.path.split('/').map(folderId => {
            return this.allFolders[+folderId];
        }).filter(subFolder => !!subFolder));
    }

    private loadChildren(params: {page?: number}, replaceChildren = false) {
        this.loading$.next(true);
        const order = `${this.sortFormControl.value.column}:${this.sortFormControl.value.direction}`;
        const page = params.page || this.pagination$.value.current_page;
        this.linkApi.findByHash(this.makeLinkHash(this.folder), {page, order, withEntries: true})
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                const oldChildren = this.children;
                const pagination = response.folderChildren;
                if ( ! replaceChildren) {
                    pagination.data = [...oldChildren, ...pagination.data];
                }
                this.setPagination(pagination);
            });
    }

    private makeLinkHash(folder?: FileEntry) {
        let hash = this.data.link.hash;
        if (folder) hash += ':' + folder.hash;
        return hash;
    }

    private setPagination(pagination: PaginationResponse<FileEntry>) {
        // add shareable link hash to all entries url to avoid permission errors
        pagination.data = pagination.data.map(entry => {
            entry.url += `?shareable_link=${this.data.link.id}`;
            if (this.password) {
                entry.url += `&password=${this.password}`;
            }
            return entry;
        });
        this.pagination$.next(pagination);
    }

    protected loadMoreItems() {
        const page = this.pagination$.value.current_page + 1;
        this.loadChildren({page}, false);
    }

    protected canLoadMore() {
        return this.pagination$.value.current_page < this.pagination$.value.last_page;
    }

    protected isLoading() {
        return this.loading$.value;
    }
}
