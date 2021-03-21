import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { Select } from '@ngxs/store';
import { DriveState } from '../state/drive-state';
import { Observable } from 'rxjs';

@Directive({
    selector: '[toggleSelectedClass]'
})
export class ToggleSelectedClassDirective implements AfterViewInit {
    @Select(DriveState.selectedEntryIds) selectedEntryIds: Observable<number[]>;

    constructor(private el: ElementRef) {}

    ngAfterViewInit() {
        this.selectedEntryIds.subscribe(ids => {
            const els = this.el.nativeElement.querySelectorAll('.drive-entry');
            if ( ! els.length) return;

            Array.from(els).forEach((el: HTMLElement) => {
                const selected = ids.indexOf(parseInt(el.dataset.id, 10)) > -1;

                if (selected) {
                    el.classList.add('selected');
                } else {
                    el.classList.remove('selected');
                }
            });
        });
    }
}
