import { Injectable } from '@angular/core';
import { DriveDomCacheService } from './drive-dom-cache.service';
import { Store } from '@ngxs/store';
import { StoppedDragging } from '../state/actions/events';
import { StartedDragging } from '../state/actions/events';

@Injectable({
    providedIn: 'root'
})
export class DragEntryService {
    constructor(
        private domCache: DriveDomCacheService,
        private store: Store
    ) {}

    public start(e: HammerInput) {
        this.store.dispatch(new StartedDragging());
    }

    public move(e: HammerInput) {
        this.domCache.dragPreview.style.top = e.center.y + 'px';
        this.domCache.dragPreview.style.left = e.center.x + 'px';
    }

    public end() {
        this.store.dispatch(new StoppedDragging());
    }
}
