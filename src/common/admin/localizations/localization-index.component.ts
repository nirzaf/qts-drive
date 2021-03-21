import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {CrupdateLocalizationModalComponent} from './crupdate-localization-modal/crupdate-localization-modal.component';
import {ActivatedRoute} from '@angular/router';
import {Settings} from '../../core/config/settings.service';
import {Modal} from '../../core/ui/dialogs/modal.service';
import {ConfirmModalComponent} from '../../core/ui/confirm-modal/confirm-modal.component';
import {Toast} from '../../core/ui/toast.service';
import {distinctUntilChanged, finalize} from 'rxjs/operators';
import {Translations} from '../../core/translations/translations.service';
import {Localizations} from '../../core/translations/localizations.service';
import {NewLineModalComponent} from './new-line-modal/new-line-modal.component';
import {CurrentUser} from '../../auth/current-user';
import {HttpErrors} from '../../core/http/errors/http-errors.enum';
import {LocalizationWithLines} from '@common/core/types/localization-with-lines';
import {BehaviorSubject} from 'rxjs';
import {BreakpointsService} from '@common/core/ui/breakpoints.service';
import {animate, style, transition, trigger} from '@angular/animations';

interface TranslationLine {
    key: string;
    translation: string;
}

@Component({
    selector: 'localization-index',
    templateUrl: './localization-index.component.html',
    styleUrls: ['./localization-index.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({opacity: 0}),
                animate('325ms ease-in', style({
                    opacity: 1,
                }))
            ])
        ]),
    ]
})
export class LocalizationIndexComponent implements OnInit {
    public loading$ = new BehaviorSubject<boolean>(false);
    public loadingLines$ = new BehaviorSubject<boolean>(false);
    public searchQuery = new FormControl();
    public selectedLocalization: LocalizationWithLines;
    public localizations$ = new BehaviorSubject<LocalizationWithLines[]>([]);
    public lines$ = new BehaviorSubject<TranslationLine[]>([]);

    constructor(
        private toast: Toast,
        private modal: Modal,
        private settings: Settings,
        private i18n: Translations,
        private route: ActivatedRoute,
        public currentUser: CurrentUser,
        private localizationsApi: Localizations,
        public breakpoints: BreakpointsService,
    ) {}

    ngOnInit() {
        this.loading$.next(true);
        this.localizationsApi.all()
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.setLocalizations(response.localizations);
                this.bindSearchQuery();
            });
    }

    private setLocalizations(localizations: LocalizationWithLines[]) {
        this.localizations$.next(localizations);
        const active = localizations.find(l => l.model.language === this.settings.get('i18n.default_localization')) || localizations[0];
        if (active) {
            this.setSelectedLocalization(active);
        }
    }

    public setSelectedLocalization(localization: LocalizationWithLines) {
        if (this.selectedLocalization?.model.id === localization.model.id) return;

        this.selectedLocalization = localization;
        this.searchQuery.setValue(null);

        // if lang lines are already fetched for this localization, bail
        if (localization.lines) {
            this.lines$.next(this.originalLines());
        } else {
            this.selectedLocalization.lines = {};
            this.loadingLines$.next(true);
            this.localizationsApi.get(this.selectedLocalization.model.name)
                .pipe(finalize(() => this.loadingLines$.next(false)))
                .subscribe(response => {
                    this.selectedLocalization = response.localization;
                    const localizations = [...this.localizations$.value];
                    const i = localizations.findIndex(loc => loc.model.id === localization.model.id);
                    localizations[i] = response.localization;
                    this.localizations$.next(localizations);
                    this.lines$.next(this.originalLines());
                });
        }
    }

    public addLine() {
        this.modal.open(NewLineModalComponent)
            .beforeClosed()
            .subscribe(line => {
                if ( ! line) return;
                this.selectedLocalization.lines[line.key] = line.value;
                this.lines$.next(this.originalLines());
            });
    }

    public setDefaultLocalization(localization: LocalizationWithLines) {
        if ( ! this.selectedLocalization.model.id) {
            this.setSelectedLocalization(localization);
        }
        this.localizationsApi.setDefault(localization.model).subscribe(() => {
            this.toast.open('Default Localization Changed');
        }, () => {
            this.toast.open(HttpErrors.Default);
        });
    }

    public updateLocalization() {
        this.loading$.next(true);
        this.localizationsApi.update(this.selectedLocalization.model.id, this.selectedLocalization)
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(() => {
                this.toast.open('Localizations updated');
                if (this.selectedLocalization.model.id === this.i18n.getActive().model.id) {
                    this.i18n.setLocalization(this.selectedLocalization);
                }
            });
    }

    public showCrupdateLocalizationModal(localization?: LocalizationWithLines) {
        this.modal.show(CrupdateLocalizationModalComponent, {localization})
            .afterClosed()
            .subscribe((newLocalization: LocalizationWithLines) => {
                if ( ! newLocalization) return;
                let localizations = [...this.localizations$.value];
                if (localization) {
                    localizations = localizations.map(l => {
                        return l.model.id === newLocalization.model.id ? newLocalization : l;
                    });
                } else {
                    localizations.push(newLocalization);
                    this.setSelectedLocalization(newLocalization);
                }
                this.localizations$.next(localizations);
            });
    }

    public confirmLocalizationDeletion(language: LocalizationWithLines) {
        if (this.localizations$.value.length < 2) {
            this.toast.open('There must be at least one localization.');
            return;
        }

        this.modal.open(ConfirmModalComponent, {
            title: 'Delete Localization',
            body: 'Are you sure you want to delete this localization?',
            ok: 'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteLocalization(language);
        });
    }

    private deleteLocalization(language: LocalizationWithLines) {
        this.localizationsApi.delete(language.model.id).subscribe(() => {
            this.toast.open('Localization deleted');
            const localizations = [...this.localizations$.value];
            localizations.splice(localizations.indexOf(language), 1);
            this.localizations$.next(localizations);

            if (this.selectedLocalization.model.id === language.model.id) {
                this.setSelectedLocalization(localizations[0]);
            }
        });
    }

    private bindSearchQuery() {
        this.searchQuery
            .valueChanges
            .pipe(distinctUntilChanged())
            .subscribe(query => {
                const lines = this.originalLines();
                this.lines$.next(query ? lines.filter(l => this.filterPredicate(l, query)) : lines);
            });
    }

    private filterPredicate(data: object, query: string) {
        const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
            // Use an obscure Unicode character to delimit the words in the concatenated string.
            // This avoids matches where the values of two columns combined will match the user's query
            // (e.g. `Flute` and `Stop` will match `Test`). The character is intended to be something
            // that has a very low chance of being typed in by somebody in a text field. This one in
            // particular is "White up-pointing triangle with dot" from
            // https://en.wikipedia.org/wiki/List_of_Unicode_characters
            return currentTerm + data[key] + '◬';
        }, '').toLowerCase();

        // Transform the filter by converting it to lowercase and removing whitespace.
        const transformedFilter = query.trim().toLowerCase();

        return dataStr.indexOf(transformedFilter) != -1;
    }

    private linesToArray(lines: {[key: string]: string}): TranslationLine[] {
        const transformed = [];
        for (const key in lines) {
            transformed.push({key, translation: lines[key]});
        }
        return transformed;
    }

    private originalLines() {
        return this.selectedLocalization.lines ?
            this.linesToArray(this.selectedLocalization.lines) :
            [];
    }

    public removeLine(line: TranslationLine) {
        delete this.selectedLocalization.lines[line.key];
        this.lines$.next(this.originalLines());
    }

    trackByFn = (i: number, localization: LocalizationWithLines) => localization.model.id;
}
