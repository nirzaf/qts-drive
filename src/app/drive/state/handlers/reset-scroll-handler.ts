import { Actions, ofActionSuccessful } from '@ngxs/store';
import { ReloadPageEntries } from '../actions/commands';
import { DriveDomCacheService } from '../../interactions/drive-dom-cache.service';
import { Injectable } from "@angular/core";

@Injectable()
export class ResetScrollHandler {
    constructor(
        private actions$: Actions,
        private domCache: DriveDomCacheService
    ) {
        this.actions$.pipe(ofActionSuccessful(ReloadPageEntries))
            .subscribe(() => {
                this.domCache.scrollCont.scrollTo({top: 0});
            });
    }
}
