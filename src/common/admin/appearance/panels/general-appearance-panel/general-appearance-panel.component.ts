import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {AppearanceEditor} from '@common/admin/appearance/appearance-editor/appearance-editor.service';

@Component({
    selector: 'general-appearance-panel',
    templateUrl: './general-appearance-panel.component.html',
    styleUrls: ['./general-appearance-panel.component.scss'],
    host: {'class': 'appearance-panel'},
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralAppearancePanelComponent implements OnInit {
    public form = this.fb.group({
        'branding.logo_light': [''],
        'branding.logo_dark': [''],
        'branding.favicon': [''],
        'env.app_name': [''],
        'branding.site_description': [''],
    });

    constructor(
        private fb: FormBuilder,
        public editor: AppearanceEditor,
    ) {}

    ngOnInit() {
        const defaults = {};
        Object.keys(this.form.controls).forEach(key => {
          defaults[key] = this.editor.currentValue(key);
        });
        this.form.patchValue(defaults);

        this.form.valueChanges.subscribe(value => {
            this.editor.addChanges(value);
        });
    }

    public defaultValue(key: string) {
        return this.editor.defaultSettings[key];
    }
}
