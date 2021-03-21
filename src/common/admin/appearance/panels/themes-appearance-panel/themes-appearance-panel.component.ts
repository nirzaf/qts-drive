import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {AppearanceEditor} from '@common/admin/appearance/appearance-editor/appearance-editor.service';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {CrupdateCssThemeModalComponent} from '@common/admin/appearance/panels/themes-appearance-panel/crupdate-css-theme-modal/crupdate-css-theme-modal.component';
import {CssTheme} from '@common/core/types/models/CssTheme';
import {CssThemeService} from '@common/admin/appearance/panels/themes-appearance-panel/css-theme.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {finalize, map} from 'rxjs/operators';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';
import {Toast} from '@common/core/ui/toast.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'themes-appearance-panel',
    templateUrl: './themes-appearance-panel.component.html',
    styleUrls: ['./themes-appearance-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemesAppearancePanelComponent implements OnInit, OnDestroy {
    public loading$ = new BehaviorSubject<boolean>(false);
    public loadedThemes$ = new BehaviorSubject<CssTheme[]>([]);
    public selectedTheme$ = new BehaviorSubject<CssTheme>(null);
    private querySub: Subscription;

    public path$ = this.selectedTheme$.pipe(map(theme => {
        const path = ['Themes'];
        if (theme) path.push(theme.name);
        return path;
    }));

    constructor(
        public appearance: AppearanceEditor,
        private modal: Modal,
        private themes: CssThemeService,
        private toast: Toast,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.reloadThemes();
    }

    ngOnDestroy() {
        this.querySub && this.querySub.unsubscribe();
    }

    public openCrupdateThemeModal(theme?: CssTheme) {
        this.modal.open(CrupdateCssThemeModalComponent, {theme})
            .afterClosed()
            .subscribe(newTheme => {
                if (newTheme) {
                    this.reloadThemes();
                }
            });
    }

    public setSelectedTheme(theme?: CssTheme) {
        this.router.navigate([], {queryParams: {theme: theme && theme.id}, queryParamsHandling: 'merge'});
    }

    public openPreviousPanel() {
        if (this.selectedTheme$.value) {
            this.setSelectedTheme();
        } else {
            this.appearance.closeActivePanel();
        }
    }

    public maybeDeleteThemeModal(theme: CssTheme) {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Theme',
            body:  'Are you sure you want to delete this theme?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteTheme(theme);
        });
    }

    private reloadThemes() {
        this.loading$.next(true);
        this.themes.all()
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.loadedThemes$.next(response.pagination.data);
                this.bindToQueryParams();
            });
    }

    private deleteTheme(theme: CssTheme) {
        this.themes.delete([theme.id]).subscribe(() => {
            this.toast.open('Theme deleted');
            this.reloadThemes();
        });
    }

    private bindToQueryParams() {
        if (this.querySub) return;
        this.querySub = this.route.queryParams.subscribe((params: {theme?: string}) => {
            const theme = this.loadedThemes$.value.find(t => t.id === +params.theme);
            this.selectedTheme$.next(theme);
        });
    }
}
