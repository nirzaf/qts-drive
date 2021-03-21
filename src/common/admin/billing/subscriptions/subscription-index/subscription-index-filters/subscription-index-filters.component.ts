import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {DatatableService} from '../../../../../datatable/datatable.service';
import {Plan} from '../../../../../core/types/models/Plan';

@Component({
    selector: 'subscription-index-filters',
    templateUrl: './subscription-index-filters.component.html',
    styleUrls: ['./subscription-index-filters.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionIndexFiltersComponent implements OnInit {
    public form = this.fb.group({
        ends_at: null,
        gateway: null,
        created_at: null,
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
