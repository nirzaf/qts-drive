import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {AppearanceEditor} from '@common/admin/appearance/appearance-editor/appearance-editor.service';
import {FormBuilder} from '@angular/forms';

interface SeoField {
    name: string;
    key: string;
    defaultValue: string;
    value: string;
}

@Component({
    selector: 'seo-appearance-panel',
    templateUrl: './seo-appearance-panel.component.html',
    styleUrls: ['./seo-appearance-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeoAppearancePanelComponent implements OnInit {
    public seoFields: SeoField[];
    public form = this.fb.group({});

    constructor(
        public editor: AppearanceEditor,
        private fb: FormBuilder,
    ) {}

    ngOnInit() {
        this.seoFields = this.editor.defaultSettings['seo_fields'];

        this.seoFields.forEach(field => {
            this.form.addControl(field.key, this.fb.control(field.value));
        });

        this.form.valueChanges.subscribe(value => {
            this.editor.addChanges(value);
        });
    }
}
