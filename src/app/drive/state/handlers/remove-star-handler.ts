import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { RemoveEntries, RemoveStar } from '../actions/commands';
import { filter } from 'rxjs/operators';
import { DriveState } from '../drive-state';
import { DRIVE_PAGE_NAMES } from '../models/drive-page';
import { Injectable } from '@angular/core';

@Injectable()
export class RemoveStarHandler {
    constructor(
        private actions$: Actions,
        private store: Store
    ) {
        this.actions$.pipe(ofActionSuccessful(RemoveStar))
            .pipe(filter(() => {
                const name = this.store.selectSnapshot(DriveState.activePage).name;
                return name === DRIVE_PAGE_NAMES.STARRED;
            }))
            .subscribe((action: RemoveStar) => {
                this.store.dispatch(new RemoveEntries(action.entries));
            });
    }
}
