import {
    ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { DriveState } from '../../state/drive-state';
import { map, take } from 'rxjs/operators';
import { MoveEntries } from '../../state/actions/commands';
import { MoveEntriesFailed, MoveEntriesSuccess } from '../../state/actions/events';
import { DriveEntry } from '../../files/models/drive-entry';
import { DriveFolder } from '../../folders/models/driveFolder';

@Component({
    selector: 'move-entries-dialog',
    templateUrl: './move-entries-dialog.component.html',
    styleUrls: ['./move-entries-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveEntriesDialogComponent implements OnInit, OnDestroy {
    @Select(DriveState.selectedEntries) selectedEntries$: Observable<DriveEntry[]>;
    public destination$ = new BehaviorSubject<DriveFolder>(this.store.selectSnapshot(DriveState.activePage).folder);
    public loading$ = new BehaviorSubject<boolean>(false);
    private subscriptions: Subscription[] = [];
    public canMove$ = this.destination$.pipe(map(destination => {
        const movingEntries = this.store.selectSnapshot(DriveState.selectedEntries);
        return DriveState.canMoveEntriesTo(movingEntries, destination);
    }));

    constructor(
        protected dialogRef: MatDialogRef<MoveEntriesDialogComponent>,
        protected store: Store,
        protected actions: Actions,
    ) {}

    ngOnInit() {
        const failure = this.actions.pipe(ofAction(MoveEntriesFailed)).subscribe(() => {
            this.loading$.next(false);
        });
        const success = this.actions.pipe(ofAction(MoveEntriesSuccess), take(1))
            .subscribe(() => {
                this.close();
            });
        this.subscriptions.push(...[success, failure]);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    public confirm() {
        this.loading$.next(true);
        this.store.dispatch(new MoveEntries(this.destination$.value))
            .subscribe(() => {
                this.loading$.next(false);
            });
    }

    public close() {
        this.dialogRef.close();
    }
}
