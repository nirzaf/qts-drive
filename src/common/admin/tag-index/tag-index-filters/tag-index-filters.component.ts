import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Settings} from '../../../core/config/settings.service';
import {DatatableService} from '../../../datatable/datatable.service';
import {Tag} from '../../../core/types/models/Tag';
import {FormBuilder} from '@angular/forms';

@Component({
    selector: 'tag-index-filters',
    templateUrl: './tag-index-filters.component.html',
    styleUrls: ['./tag-index-filters.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagIndexFiltersComponent implements OnInit {
    public types: object[] = [];
    public form = this.fb.group({
        type: null,
    });

    constructor(
        private fb: FormBuilder,
        private datable: DatatableService<Tag>,
        private settings: Settings,
    ) {
        this.form.patchValue(this.datable.filters$.value);
    }

    ngOnInit() {
        this.types = this.settings.get('vebto.admin.tagTypes');
        this.form.valueChanges.subscribe(value => {
            this.datable.filters$.next(value);
        });
    }
}
