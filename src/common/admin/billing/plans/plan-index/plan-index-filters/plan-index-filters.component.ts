import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {DatatableService} from '../../../../../datatable/datatable.service';
import {Plan} from '../../../../../core/types/models/Plan';

@Component({
    selector: 'plan-index-filters',
    templateUrl: './plan-index-filters.component.html',
    styleUrls: ['./plan-index-filters.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanIndexFiltersComponent implements OnInit {
    public form = this.fb.group({
        currency: null,
        interval: null,
        parent_id: null,
        recommended: null,
    });

    constructor(
        private fb: FormBuilder,
        private datable: DatatableService<Plan>,
    ) {
        this.form.patchValue(this.datable.filters$.value);
    }

    ngOnInit() {
        this.form.valueChanges.subscribe(value => {
            this.datable.filters$.next(value);
        });
    }
}
