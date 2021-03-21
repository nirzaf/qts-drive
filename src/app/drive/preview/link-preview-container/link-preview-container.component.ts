import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetLinkData, ShareableLinksApiService } from '../../sharing/links/shareable-links-api.service';
import { BehaviorSubject, fromEvent, Observable, Subscription } from 'rxjs';
import { PreviewFilesService } from '@common/file-preview/preview-files.service';
import { Settings } from '@common/core/config/settings.service';
import { CurrentUser } from '@common/auth/current-user';
import { filter, map } from 'rxjs/operators';
import { Toast } from '@common/core/ui/toast.service';
import { Store } from '@ngxs/store';
import { DownloadEntries, SetViewMode } from '../../state/actions/commands';
import { ShareableLink } from '../../sharing/links/models/shareable-link';
import { VIEW_MODE_KEY } from '../../state/models/drive-state-model';
import { LocalStorage } from '@common/core/services/local-storage.service';

@Component({
    selector: 'link-preview-container',
    templateUrl: './link-preview-container.component.html',
    styleUrls: ['./link-preview-container.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        PreviewFilesService,
    ]
})
export class LinkPreviewContainerComponent implements OnInit, OnDestroy {
    public data$: BehaviorSubject<GetLinkData> = new BehaviorSubject(null);
    public passwordPanelVisible$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public password: string;
    private downloadSub: Subscription;

    /**
     * Check if current user owns this entry or
     * already has it imported into their drive.
     */
    public get entryAlreadyImported$(): Observable<boolean> {
        const userId = this.currentUser.get('id');
        return this.data$.pipe(
            map(data => data.link),
            filter(link => !!link && !!link.entry && !!link.entry.users),
            map(link => link.entry),
            map(entry => !!entry.users.find(user => user.id === userId))
        );
    }

    constructor(
        private store: Store,
        private route: ActivatedRoute,
        private links: ShareableLinksApiService,
        public previewFiles: PreviewFilesService,
        public settings: Settings,
        public currentUser: CurrentUser,
        private router: Router,
        private toast: Toast,
        private el: ElementRef<HTMLElement>,
        private localStorage: LocalStorage,
    ) {}

    ngOnInit() {
        this.bindToDownload();
        this.disableContextMenu();
        this.setViewMode();
        this.route.params.subscribe(params => {
            this.links.findByHash(params.hash, {withEntries: true}).subscribe(response => {
                const linkChanged = response.link.id !== (this.data$.value && this.data$.value.link.id);
                this.data$.next(response);
                this.setBackgroundClass(response.link);

                // prevent asking password for nested folders, if user already entered password
                if (response.link.password && (linkChanged || !this.password)) {
                    this.togglePasswordPanel(true);
                } else {
                    this.togglePasswordPanel(false);
                    this.showPreview();
                }
            }, () => {
                this.router.navigate(['/404']);
            });
        });
    }

    ngOnDestroy() {
        this.downloadSub.unsubscribe();
    }

    public import() {
        this.links.importEntry(this.data$.value.link.id, this.password)
            .subscribe(response => {
                const link = this.data$.value.link;
                link.entry.users = response.users;
                this.data$.next({...this.data$.value, link});
                this.toast.open({
                    message: `":name" imported into your drive.`,
                    replacements: {name: link.entry.name},
                });
            });
    }

    public togglePasswordPanel(value: boolean) {
        this.passwordPanelVisible$.next(value);
    }

    private bindToDownload() {
        this.downloadSub = this.previewFiles.download.subscribe(() => {
            const link = this.data$.value.link;
            this.store.dispatch(new DownloadEntries([link.entry], link, this.password));
        });
    }

    /**
     * Show preview for shareable link files.
     */
    private showPreview() {
        const data = this.data$.value;
        data.link.entry.url += `?shareable_link=${data.link.id}`;
        if (this.password) {
            data.link.entry.url += `&password=${this.password}`;
        }
        this.data$.next({...data});
    }

    public setValidPassword(password: string) {
        this.password = password;
        this.showPreview();
        this.togglePasswordPanel(false);
    }

    private setBackgroundClass(link: ShareableLink) {
        const className = link.entry.type === 'folder' ? 'folder-link' : 'file-link';
        this.el.nativeElement.classList.add(className);
    }

    private disableContextMenu() {
        fromEvent(this.el.nativeElement, 'contextmenu')
            .subscribe(e => {
                e.preventDefault();
            });
    }

    private setViewMode() {
        this.store.dispatch(new SetViewMode(
            this.localStorage.get(VIEW_MODE_KEY, this.settings.get('drive.default_view', 'grid')))
        );
    }
}
