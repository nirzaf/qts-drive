import {
    ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ReloadPageEntries } from '../../state/actions/commands';
import { SortColumn, SortValue } from '../../entries/available-sorts';
import { DriveState } from '../../state/drive-state';
import { combineLatest, Observable } from 'rxjs';
import { DrivePage } from '../../state/models/drive-page';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'file-list-header',
    templateUrl: './file-list-header.component.html',
    styleUrls: ['./file-list-header.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileListHeaderComponent implements OnInit {
    @Select(DriveState.sortColumn) sortColumn$: Observable<SortColumn>;
    @Select(DriveState.activePage) activePage$: Observable<DrivePage>;

    public sortFormControl = new FormControl({
        column: this.store.selectSnapshot(DriveState.sortColumn),
        direction: this.store.selectSnapshot(DriveState.sortDirection),
    });

    constructor(private store: Store) {}

    ngOnInit() {
        combineLatest([
            this.store.select(DriveState.sortColumn),
            this.store.select(DriveState.sortDirection),
        ]).subscribe(([column, direction]) => {
            this.sortFormControl.setValue({column, direction}, {emitEvent: false});
        });
        this.sortFormControl.valueChanges.subscribe((sort: SortValue) => {
            this.store.dispatch(new ReloadPageEntries(
                {orderBy: sort.column, orderDir: sort.direction}
            ));
        });
    }
}
