import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {DatatableService} from '../../../datatable/datatable.service';
import {Model} from '../../../core/types/models/model';
import {Settings} from '../../../core/config/settings.service';

@Component({
    selector: 'user-index-filters',
    templateUrl: './user-index-filters.component.html',
    styleUrls: ['./user-index-filters.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserIndexFiltersComponent implements OnInit {
    public form = this.fb.group({
        subscribed: null,
        email_verified_at: null,
        created_at: null,
    });

    constructor(
        private fb: FormBuilder,
        private datable: DatatableService<Model>,
        public settings: Settings,
    ) {
        this.form.patchValue(this.datable.filters$.value);
    }

    ngOnInit() {
        this.form.valueChanges.subscribe(value => {
            this.datable.filters$.next(value);
        });
    }
}
