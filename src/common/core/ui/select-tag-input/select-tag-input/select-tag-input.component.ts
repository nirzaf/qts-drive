import {ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {catchError, debounceTime, distinctUntilChanged, finalize, map, switchMap} from 'rxjs/operators';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Tag} from '@common/core/types/models/Tag';
import {TagsService} from '@common/core/services/tags.service';

@Component({
    selector: 'select-tag-input',
    templateUrl: './select-tag-input.component.html',
    styleUrls: ['./select-tag-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: SelectTagInputComponent,
        multi: true,
    }]
})
export class SelectTagInputComponent implements ControlValueAccessor, OnInit {
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef<HTMLInputElement>;
    public searchFormControl = new FormControl();
    public loading$ = new BehaviorSubject(false);
    public tags$ = new BehaviorSubject<Tag[]>([]);
    public selectedTag$ = new BehaviorSubject<Tag>(null);
    private propagateChange: Function;
    public searchedOnce = false;

    constructor(private tags: TagsService) {}

    ngOnInit() {
        this.bindToSearchControl();
    }

    public writeValue(value: Tag) {
        this.selectedTag$.next(value);
    }

    public registerOnChange(fn: Function) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {}

    private bindToSearchControl() {
        this.searchFormControl.valueChanges.pipe(
            debounceTime(150),
            distinctUntilChanged(),
            switchMap(query => this.searchTags(query)),
            catchError(() => of([])),
        ).subscribe(tags => {
            this.searchedOnce = true;
            this.tags$.next(tags);
        });
    }

    private searchTags(query: string): Observable<Tag[]> {
        this.loading$.next(true);
        return this.tags.index({query, perPage: 7})
            .pipe(
                map(response => response.pagination.data),
                finalize(() =>  this.loading$.next(false))
            );
    }

    public onMenuOpened() {
        if (!this.searchedOnce) {
            this.clearSearchInput();
        }
        setTimeout(() => {
            this.searchInput.nativeElement.focus();
        });
    }

    public selectTag(tag: Tag) {
        this.selectedTag$.next(tag);
        this.propagateChange(tag);
    }

    public clearSearchInput() {
        this.searchFormControl.setValue('');
    }

    public onMenuClosed() {
        this.loading$.next(false);
        this.clearSearchInput();
    }
}
