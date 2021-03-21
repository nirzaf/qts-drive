import { Store } from '@ngxs/store';
import { DeselectAllEntries } from '../actions/commands';
import { DriveState } from '../drive-state';
import { filter } from 'rxjs/operators';
import { Injectable } from "@angular/core";

@Injectable()
export class PageChangeHandler {
    constructor(
        private store: Store
    ) {
        this.store.select(DriveState.activePage)
            .pipe(filter(page => !!page))
            .subscribe(() => {
                this.store.dispatch(new DeselectAllEntries());
            });
    }
}
