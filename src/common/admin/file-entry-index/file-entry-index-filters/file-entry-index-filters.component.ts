import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {DatatableService} from '../../../datatable/datatable.service';
import {Model} from '../../../core/types/models/model';

@Component({
    selector: 'file-entry-index-filters',
    templateUrl: './file-entry-index-filters.component.html',
    styleUrls: ['./file-entry-index-filters.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileEntryIndexFiltersComponent implements OnInit {
    public form = this.fb.group({
        type: null,
        public: null,
        password: null,
        created_at: null,
        owner: null,
    });

    constructor(
        private fb: FormBuilder,
        private datable: DatatableService<Model>,
    ) {
        this.form.patchValue(this.datable.filters$.value);
    }

    ngOnInit() {
        this.form.valueChanges.subscribe(value => {
            this.datable.filters$.next(value);
        });
    }
}
