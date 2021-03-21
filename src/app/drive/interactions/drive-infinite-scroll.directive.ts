import { Directive, ElementRef, NgZone } from '@angular/core';
import { LoadMoreEntries } from '../state/actions/commands';
import { Store } from '@ngxs/store';
import { DriveState } from '../state/drive-state';
import { InfiniteScroll } from '@common/core/ui/infinite-scroll/infinite.scroll';

@Directive({
    selector: '[driveInfiniteScroll]'
})
export class DriveInfiniteScrollDirective extends InfiniteScroll {
    constructor(
        protected el: ElementRef,
        protected store: Store,
        protected zone: NgZone,
    ) {
        super();
    }

    protected loadMoreItems() {
        const page = this.store.selectSnapshot(DriveState.currentPage) + 1;
        this.store.dispatch(new LoadMoreEntries({page}));
    }

    protected isLoading(): boolean {
        return this.store.selectSnapshot(DriveState.loading);
    }

    protected canLoadMore(): boolean {
        return this.store.selectSnapshot(DriveState.canLoadMoreEntries);
    }
}
