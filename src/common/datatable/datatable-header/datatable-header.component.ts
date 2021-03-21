import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild
} from '@angular/core';
import {DatatableService} from '../datatable.service';
import {Model} from '../../core/types/models/model';
import {Subscription} from 'rxjs';
import {OverlayPanel} from '../../core/ui/overlay-panel/overlay-panel.service';
import {LEFT_POSITION} from '../../core/ui/overlay-panel/positions/left-position';
import {OverlayPanelRef} from '../../core/ui/overlay-panel/overlay-panel-ref';
import {DatatableFiltersPanelComponent} from '../datatable-filters-panel/datatable-filters-panel.component';
import {map} from 'rxjs/operators';
import {removeNullFromObject} from '../../core/utils/remove-null-from-object';
import {DatatableFilterValue} from '../types/datatable-filters';

@Component({
    selector: 'datatable-header',
    templateUrl: './datatable-header.component.html',
    styleUrls: ['./datatable-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatatableHeaderComponent implements OnInit, OnDestroy {
    @HostBinding('class.rows-selected') public numberOfRowsSelected: number;
    @ContentChild('tableFilters') filterPanelTemplate: TemplateRef<ElementRef>;
    @ViewChild('filterButton', { read: ElementRef }) filterButton: ElementRef<HTMLButtonElement>;
    @Input() pluralResourceName: string;
    @Input() showSelectedActions = true;
    private subscriptions: Subscription[] = [];
    public filterPanelRef: OverlayPanelRef<any>;

    public filters$ = this.datatable.filters$
        .pipe(map(v => {
            const filters = removeNullFromObject(v);
            delete filters.query;
            return filters;
        }));

    constructor(
        public datatable: DatatableService<Model>,
        private cd: ChangeDetectorRef,
        private overlayPanel: OverlayPanel,
    ) {}

    ngOnInit() {
        // close filter panel when any filter is selected.
        const filterSub = this.datatable.filters$.subscribe(() => {
            this.filterPanelRef && this.filterPanelRef.close();
        });
        const changeSub = this.datatable.selectedRows$.subscribe(value => {
            this.numberOfRowsSelected = value.length;
            this.cd.markForCheck();
        });
        this.subscriptions = [filterSub, changeSub];
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    public openFiltersPanel() {
        if (this.filterPanelRef) {
            this.filterPanelRef.close();
        } else {
            const position = LEFT_POSITION.slice();
            position[0].offsetY = 40;
            position[1].offsetY = 40;
            this.filterPanelRef = this.overlayPanel.open(DatatableFiltersPanelComponent, {
                origin: this.filterButton,
                position,
                mobilePosition: 'center',
                data: {filters: this.filterPanelTemplate},
                maxWidth: '90%',
            });
            this.filterButton.nativeElement.classList.add('active');
            this.filterPanelRef.afterClosed().subscribe(() => {
                this.filterPanelRef = null;
                this.filterButton.nativeElement.classList.remove('active');
            });
        }
    }

    public isModel(value: DatatableFilterValue) {
        return typeof value === 'object' && value.id;
    }
}
