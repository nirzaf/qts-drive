import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';
import { AVAILABLE_SORTS, DriveSortOption, SortColumn, SortDirection, SortValue } from '../../entries/available-sorts';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

const DEFAULT_VALUE: SortValue = {column: 'updated_at', direction: 'desc'};

@Component({
    selector: 'entries-sort-button',
    templateUrl: './entries-sort-button.component.html',
    styleUrls: ['./entries-sort-button.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: EntriesSortButtonComponent,
        multi: true,
    }]
})
export class EntriesSortButtonComponent implements ControlValueAccessor {
    @Input() btnDisabled = false;
    public availableSorts = AVAILABLE_SORTS;
    public propagateChange: Function;

    public sort$: BehaviorSubject<SortValue> = new BehaviorSubject(DEFAULT_VALUE);

    public changeSort(column: DriveSortOption) {
        this.sort$.next({...this.sort$.value, column: column.name});
        this.propagateChange(this.sort$.value);
    }

    public changeDirection(direction: SortDirection) {
        this.sort$.next({...this.sort$.value, direction});
        this.propagateChange(this.sort$.value);
    }

    public getSortViewName(column: SortColumn): string {
        return this.availableSorts.find(sort => sort.name === column).viewName;
    }

    public writeValue(value: SortValue) {
        this.sort$.next(value || DEFAULT_VALUE);
    }

    public registerOnChange(fn: Function) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {}
}
