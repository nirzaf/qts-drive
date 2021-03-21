import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {DatatableService} from '../../datatable.service';
import {Model} from '@common/core/types/models/model';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'datatable-header-search-input',
    templateUrl: './datatable-header-search-input.component.html',
    styleUrls: ['./datatable-header-search-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatatableHeaderSearchInputComponent implements OnInit {
    public searchControl = new FormControl(this.route.snapshot.queryParams.query);
    @Input() placeholder: string;
    @Input() hideIcon = false;

    constructor(
        public datatable: DatatableService<Model>,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.searchControl.valueChanges
            .pipe(debounceTime(400), distinctUntilChanged())
            .subscribe(query => {
                this.datatable.addFilter('query', query);
            });
    }
}
