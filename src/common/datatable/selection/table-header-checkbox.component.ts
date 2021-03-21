import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {DatatableService} from '../datatable.service';
import {Subscription} from 'rxjs';
import {Model} from '../../core/types/models/model';

@Component({
    selector: '[table-header-checkbox]',
    template: `
        <mat-checkbox
            (change)="$event ? toggleAllRows() : null"
            [checked]="allRowsSelected()"
            [indeterminate]="anyRowsSelected() && ! allRowsSelected()">
        </mat-checkbox>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'table-checkbox'},
})
export class TableHeaderCheckboxComponent implements OnInit, OnDestroy{
    private changeRef: Subscription;
    constructor(
        public datatable: DatatableService<Model>,
        private cd: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.changeRef = this.datatable.selectedRows$.subscribe(() => {
            this.cd.markForCheck();
        });
    }

    ngOnDestroy() {
        this.changeRef.unsubscribe();
    }

    public anyRowsSelected(): boolean {
        return !!this.datatable.selectedRows$.value.length;
    }

    public allRowsSelected() {
        return this.datatable.selectedRows$.value.length &&
            this.datatable.selectedRows$.value.length === this.datatable.data$.value?.length;
    }

    public toggleAllRows() {
        if (this.allRowsSelected()) {
            this.datatable.selectedRows$.next([]);
        } else {
            this.datatable.selectedRows$.next(
                this.datatable.data$.value.map(v => v.id)
            );
        }
    }
}
