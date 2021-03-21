import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {DatatableService} from '../datatable.service';
import {Subscription} from 'rxjs';
import {Model} from '../../core/types/models/model';
import {FocusMonitor} from '@angular/cdk/a11y';
import {filter} from 'rxjs/operators';
import {ENTER, SPACE} from '@angular/cdk/keycodes';
import {slugifyString} from '../../core/utils/slugify-string';

@Component({
    selector: '[table-sort-header]',
    templateUrl: './table-sort-header.component.html',
    styleUrls: ['./table-sort-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'tabindex': '0',
        '(click)': 'handleClick()',
        '(keydown)': 'handleKeydown($event)',
        '(mouseenter)': 'onMouseEnter()',
        '(mouseleave)': 'onMouseLeave()',
    }
})
export class TableSortHeaderComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('columnName', {static: true}) columnName: ElementRef<HTMLElement>;
    @Input('table-sort-header') public orderBy: string;

    @HostBinding('class.active')
    public orderDir: 'desc'|'asc'|null = null;

    @HostBinding('class.sort-disabled') get sortDisabled() {
        return this.datable.config?.disableSort;
    }

    private sortSub: Subscription;
    public arrowVisible = false;
    public arrowDirection: 'down'|'up' = 'down';

    constructor(
        public datable: DatatableService<Model>,
        private cd: ChangeDetectorRef,
        private focusMonitor: FocusMonitor,
        private el: ElementRef<HTMLElement>,
    ) {}

    ngOnInit() {
        // get column name from <ng-content> if none is explicitly provided
        if ( ! this.orderBy) {
            this.orderBy = slugifyString(this.columnName.nativeElement.textContent, '_');
        }

        // hide arrow when sort column is changed to different column
        this.sortSub = this.datable.sort$
            .pipe(filter(sort => (sort.orderBy !== this.orderBy)))
            .subscribe(() => {
                this.orderDir = null;
                this.onMouseLeave();
                this.cd.markForCheck();
            });
    }

    ngAfterViewInit() {
        // add '.cdk-keyboard-focused' when tabbing to other sort headers
        this.focusMonitor.monitor(this.el).subscribe();
    }

    ngOnDestroy() {
        this.sortSub.unsubscribe();
        this.focusMonitor.stopMonitoring(this.el);
    }

    public changeSort() {
        this.datable.sort$.next({
            orderBy: this.orderBy,
            orderDir: this.getDirection(this.orderDir),
        });
    }

    private getDirection(current: string) {
        switch (current) {
            case 'asc':
                this.arrowVisible = false;
                return this.orderDir = null;
            case 'desc':
                this.arrowVisible = true;
                this.arrowDirection = 'up';
                return this.orderDir = 'asc';
            default:
                this.arrowVisible = true;
                this.arrowDirection = 'down';
                return this.orderDir = 'desc';
        }
    }

    public onMouseEnter() {
        if ( ! this.datable.config?.disableSort) {
            this.arrowVisible = true;
        }
    }

    public onMouseLeave() {
        this.arrowVisible = false;
        if ( ! this.orderDir) {
            this.arrowDirection = 'down';
        }
    }

    public handleClick() {
        if ( ! this.datable.config?.disableSort) {
            this.changeSort();
        }
    }

    public handleKeydown(e: KeyboardEvent) {
        if ( !this.datable.config?.disableSort && (e.keyCode === SPACE || e.keyCode === ENTER)) {
            e.preventDefault();
            this.changeSort();
        }
    }
}
