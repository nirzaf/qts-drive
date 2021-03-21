import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DatatableService} from '../datatable.service';
import {Subscription} from 'rxjs';
import {Model} from '../../core/types/models/model';

@Component({
    selector: '[table-body-checkbox]',
    template: `
        <mat-checkbox (click)="$event.stopPropagation()"
                      (change)="$event ? toggleRow(rowId) : null"
                      [checked]="isRowSelected(rowId)">
        </mat-checkbox>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'table-checkbox'}
})
export class TableBodyCheckboxComponent implements OnInit, OnDestroy {
    @Input('table-body-checkbox') rowId: number;
    private changeRef: Subscription;

    constructor(
        public datatable: DatatableService<Model>,
        private cd: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.changeRef = this.datatable.selectedRows$.subscribe(value => {
            this.cd.markForCheck();
        });
    }

    ngOnDestroy() {
        this.changeRef.unsubscribe();
    }

    public isRowSelected(id: number): boolean {
        return this.datatable.selectedRows$.value.indexOf(id) > -1;
    }

    public toggleRow(id: number) {
        if (this.isRowSelected(id)) {
            const array = this.datatable.selectedRows$.value.slice();
            const i = this.datatable.selectedRows$.value.indexOf(id);
            array.splice(i, 1);
            this.datatable.selectedRows$.next(array);
        } else {
            this.datatable.selectedRows$.next(
                [...this.datatable.selectedRows$.value, id]
            );
        }
    }
}
