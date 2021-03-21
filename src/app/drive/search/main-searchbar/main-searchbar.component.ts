import {
    ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { SEARCH_FILE_TYPES } from '../search-file-types';
import {
    MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger
} from '@angular/material/autocomplete';
import { Store } from '@ngxs/store';
import { OpenSearchPage } from '../../state/actions/commands';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import {
    DriveEntriesPaginationResponse, DriveEntryApiService
} from '../../drive-entry-api.service';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { DriveEntry } from '../../files/models/drive-entry';
import { EntryDoubleTapped } from '../../state/actions/events';
import { EMPTY_PAGINATION_RESPONSE } from '@common/core/types/pagination/pagination-response';

interface SearchResult {
    type: 'entry'|'entryType';
    content: DriveEntry|{name: string, type: string};
}

@Component({
    selector: 'main-searchbar',
    templateUrl: './main-searchbar.component.html',
    styleUrls: ['./main-searchbar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainSearchbarComponent implements OnInit {
    @ViewChild('trigger', { read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
    @ViewChild('trigger', { read: ElementRef }) input: ElementRef<HTMLInputElement>;
    @ViewChild('auto') autocomplete: MatAutocomplete;
    private defaultResults: SearchResult[] = [];
    public formControl = new FormControl();
    public results$: BehaviorSubject<SearchResult[]> = new BehaviorSubject([]);
    private lastQuery: string;

    constructor(
        private store: Store,
        private driveApi: DriveEntryApiService,
    ) {
        this.setDefaultResults();
    }

    ngOnInit() {
        this.formControl.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            filter(q => typeof q === 'string'),
            switchMap(query => this.search(query))
        ).subscribe(response => {
            this.results$.next((response.data || []).map(entry => {
                return {type: 'entry', content: entry} as SearchResult;
            }));
        });
    }

    public executeAction(e: MatAutocompleteSelectedEvent) {
        const value = e.option.value as SearchResult;

        if (value.type === 'entryType') {
            this.openSearchPage({type: value.content.type});
            this.resetForm();
        } else {
            this.store.dispatch(new EntryDoubleTapped(value.content as DriveEntry));
        }

        this.closePanelAndBlur();
    }

    public openSearchPage(params: {type?: string, query?: string}) {
        this.store.dispatch(new OpenSearchPage(params)).subscribe(() => {
            this.closePanelAndBlur();
        });
    }

    private search(query: string): Observable<DriveEntriesPaginationResponse> {
        this.lastQuery = query;
        if ( ! query || query.length < 3) {
            return observableOf(EMPTY_PAGINATION_RESPONSE) as any;
        }
        return this.driveApi.getCurrentUserEntries({query, per_page: 8});
    }

    private setDefaultResults() {
        this.defaultResults = SEARCH_FILE_TYPES.map(entryType => {
            return {type: 'entryType', content: entryType} as SearchResult;
        });

        this.results$.next(this.defaultResults);
    }

    public resetForm() {
        this.formControl.reset();
        this.setDefaultResults();
        this.lastQuery = null;
    }

    private closePanelAndBlur() {
        this.trigger.closePanel();
        this.input.nativeElement.blur();
    }

    displayFn = () => {
        // always show original user query when
        // clicking on any autocomplete option
        return this.lastQuery || '';
    }
}
