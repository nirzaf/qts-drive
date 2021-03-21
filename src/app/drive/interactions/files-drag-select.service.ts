import { Injectable } from '@angular/core';
import { EntriesSelectedViaDrag } from '../state/actions/events';
import { Store } from '@ngxs/store';
import { DriveDomCacheService } from './drive-dom-cache.service';
import { DriveState } from '../state/drive-state';

const GRID_ITEM_SELECTOR = '.drive-entry';

type AreaEdge = 'top'|'left'|'right'|'bottom'|false;

interface SelectorRect extends ClientRect {
    height: number;
    width: number;
}

@Injectable({
    providedIn: 'root'
})
export class FilesDragSelectService {
    private selectBox: HTMLDivElement;
    private initial = {x: 0, y: 0, scrollTop: 0};
    private lastPanEvent: HammerInput|null;
    private scrollListener: EventListener;
    private gridElements: HTMLElement[];

    constructor(
        private store: Store,
        private cache: DriveDomCacheService,
    ) {}

    public start(e: HammerInput) {
        this.cacheClientRects();
        this.createSelectBox();
        this.bindScroll();
        this.gridElements = this.getGridElements();

        this.initial = {
            ...this.hammerToRelative(e),
            scrollTop: this.cache.scrollCont.scrollTop,
        };

        this.selectBox.style.top = this.initial.y + 'px';
        this.selectBox.style.left = this.initial.x + 'px';


    }

    public move(e: HammerInput) {
        this.lastPanEvent = e;
        this.resizeBox(e);
    }

    public end() {
        this.removeSelectBox();
        this.dispatchSelectedAction();
        this.unbindScroll();
        this.gridElements = [];
    }

    public resizeBox(e?: HammerInput|null) {
        if ( ! e) e = this.lastPanEvent;
        if ( ! e || ! this.selectBox) return;
        const newPos = this.getNewSelectorPosition(e);
        this.scrollAndRepositionSelector(newPos);
        this.selectIntersectingElements();
    }

    /**
     * Calculate new position of selector box.
     */
    private getNewSelectorPosition(e: HammerInput): SelectorRect {
        const current = this.hammerToRelative(e);

        let tmp,
            x1 = this.initial.x,
            y1 = this.initial.y,
            x2 = current.x,
            y2 = current.y;

        if (x1 > x2) { tmp = x2; x2 = x1; x1 = tmp; }
        if (y1 > y2) { tmp = y2; y2 = y1; y1 = tmp; }

        return {
            width: x2 - x1,
            height: y2 - y1,
            top: y1,
            right: x1 + (x2 - x1), // left + width
            bottom: y1 + (y2 - y1), // top + height
            left: x1,
        };
    }

    /**
     * Check if specified position intersects any container edge.
     */
    private reachedAreaEdge(newPos: ClientRect): AreaEdge {
        const area = this.rectToRelative(this.cache.filesContRect);

        if (newPos.left <= area.left) {
            return 'left';
        } else if (newPos.top <= area.top) {
            return 'top';
        } else if (newPos.right >= area.right) {
            return 'right';
        } else if (newPos.bottom >= area.bottom) {
            return 'bottom';
        }

        return false;
    }

    /**
     * Auto scroll container (if needed) and reposition selector box.
     */
    private scrollAndRepositionSelector(newPos: SelectorRect) {
        const area = this.cache.scrollCont,
            edge = this.reachedAreaEdge(newPos);

        // make sure top always starts at the same coordinates
        // regardless of any scrolling done during dragging
        newPos.top += this.initial.scrollTop;

        // auto scroll when cursor reaches container edge
        if (edge === 'bottom') {
            area.scrollBy({top: 4});
        } else if (edge === 'top') {
            area.scrollBy({top: -4});
        }

        // scroll diff between drag start and now (auto scroll or mouse wheel)
        const scrollDiff = this.cache.scrollCont.scrollTop - this.initial.scrollTop,
            scrollValue = Math.abs(scrollDiff);

        // top needs to be changed only if scroll direction is top
        if (scrollDiff < 0) {
            newPos.top -= scrollValue;
        }

        // height needs to be changed regardless of direction and method
        newPos.height += scrollValue;

        // check if we have reached bottom edge again, after scroll values are applied
        const reachedBottom = (newPos.top + newPos.height) >= this.cache.scrollCont.scrollHeight;

        // if any select area edge is reached, bail
        if (edge === 'left' || edge === 'right' || reachedBottom) return;

        // finally, reposition select box with scroll values applied
        this.applyPosition(newPos);
    }

    /**
     * Apply specified position to selector box.
     */
    private applyPosition(newPos: ClientRect) {
        this.selectBox.style.width = newPos.width + 'px';
        this.selectBox.style.height = newPos.height + 'px';
        this.selectBox.style.left = newPos.left + 'px';
        this.selectBox.style.top = newPos.top + 'px';
    }

    private selectIntersectingElements() {
        const selectedBoxRect = this.selectBox.getBoundingClientRect();
        this.gridElements.forEach((gridItem: HTMLElement) => {
            const rect = gridItem.getBoundingClientRect();

            // item intersects the select box
            if (rect.top + rect.height > selectedBoxRect.top
                && rect.left + rect.width > selectedBoxRect.left
                && rect.bottom - rect.height < selectedBoxRect.bottom
                && rect.right - rect.width < selectedBoxRect.right) {
                gridItem.classList.add('selected');
            } else {
                gridItem.classList.remove('selected');
            }
        });
    }

    /**
     * Transform absolute container client rect into relative.
     */
    private rectToRelative(rect: ClientRect): ClientRect {
        return {
            width: rect.width,
            height: rect.height,
            left: rect.left - this.cache.filesContRect.left,
            top: rect.top - this.cache.filesContRect.top,
            right: rect.right - this.cache.filesContRect.left,
            bottom: rect.bottom - this.cache.filesContRect.top
        };
    }

    /**
     * Transform hammer absolute event to relative coordinates.
     */
    private hammerToRelative(e: HammerInput) {
        return {
            x: e.center.x - this.cache.filesContRect.left,
            y: e.center.y - this.cache.filesContRect.top
        };
    }

    private dispatchSelectedAction() {
        const ids = this.gridElements
            .filter(el => el.classList.contains('selected'))
            .map(el => +el.dataset.id);

        const entries = this.store.selectSnapshot(DriveState.entries)
            .filter(entry => ids.indexOf(entry.id) > -1);

        this.store.dispatch(new EntriesSelectedViaDrag(entries));
    }

    private createSelectBox() {
        this.selectBox = document.createElement('div');
        this.selectBox.classList.add('files-select-box');
        this.cache.filesCont.appendChild(this.selectBox);
    }

    public removeSelectBox() {
        if ( ! this.selectBox) return;
        this.selectBox.remove();
        this.selectBox = null;
    }

    public dragging() {
        return !!this.selectBox;
    }

    private cacheClientRects() {
        this.cache.filesContRect = this.cache.filesCont.getBoundingClientRect();
        this.cache.scrollContRect = this.cache.scrollCont.getBoundingClientRect();
    }

    private getGridElements(): HTMLElement[] {
        return Array.from(this.cache.filesCont.querySelectorAll(GRID_ITEM_SELECTOR));
    }

    private bindScroll() {
        this.scrollListener = () => this.resizeBox();
        this.cache.scrollCont.addEventListener('scroll', this.scrollListener);
    }

    private unbindScroll() {
        this.cache.scrollCont.removeEventListener('scroll', this.scrollListener);
    }
}
