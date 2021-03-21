import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FormArray, FormBuilder} from '@angular/forms';
import {AppearanceEditor} from '@common/admin/appearance/appearance-editor/appearance-editor.service';
import {Settings} from '@common/core/config/settings.service';
import {map} from 'rxjs/operators';
import * as Dot from 'dot-object';
import { HomepageContent } from '../../../homepage/homepage-content';

const CONFIG_KEY = 'homepage.appearance';

@Component({
    selector: 'homepage-appearance-panel',
    templateUrl: './homepage-appearance-panel.component.html',
    styleUrls: ['./homepage-appearance-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomepageAppearancePanelComponent implements OnInit {
    public selectedSubpanel$ = new BehaviorSubject<string>(null);
    public defaultValues: HomepageContent;

    public path$ = this.selectedSubpanel$.pipe(map(panel => {
        const path = ['Homepage'];
        if (panel) path.push(panel);
        return path;
    }));

    public form = this.fb.group({
        headerTitle: [''],
        headerSubtitle: [''],
        headerImage: [''],
        headerImageOpacity: [1],
        headerOverlayColor1: [''],
        headerOverlayColor2: [''],
        footerTitle: [''],
        footerSubtitle: [''],
        footerImage: [''],
        actions: this.fb.group({
            cta1: [''],
            cta2: [''],
            cta3: [''],
        }),
        primaryFeatures: this.fb.array([]),
        secondaryFeatures: this.fb.array([]),
    });

    constructor(
        private fb: FormBuilder,
        private editor: AppearanceEditor,
        private settings: Settings,
    ) {}

    ngOnInit() {
        const data = this.settings.getJson(CONFIG_KEY, {}) as HomepageContent;
        this.defaultValues = this.editor.defaultSettings[CONFIG_KEY] ? JSON.parse(this.editor.defaultSettings[CONFIG_KEY]) : {};

        (data.primaryFeatures || []).forEach(() => {
            this.addFeature('primary');
        });
        (data.secondaryFeatures || []).forEach(() => {
            this.addFeature('secondary');
        });

        this.form.patchValue(data);

        this.form.valueChanges.subscribe(value => {
            this.editor.setConfig(CONFIG_KEY, value);
            this.editor.addChanges({[CONFIG_KEY]: value});
        });
    }

    public openPreviousPanel() {
        if (this.selectedSubpanel$.value) {
            this.openSubpanel(null);
        } else {
            this.editor.closeActivePanel();
        }
    }

    public openSubpanel(name: string) {
        this.selectedSubpanel$.next(name);
    }

    public addFeature(type: 'primary'|'secondary') {
        const features = this.form.get(`${type}Features`) as FormArray;
        const data: {[key: string]: string[]} = {title: [''], subtitle: [''], image: ['']};
        if (type === 'secondary') {
            data.description = [''];
        }
        features.push(this.fb.group(data));
    }

    public removeFeature(type: 'primary'|'secondary', index: number) {
        const features = this.form.get(`${type}Features`) as FormArray;
        features.removeAt(index);
    }

    public defaultValue(key: string): string {
        return Dot.pick(key, this.defaultValues) || '';
    }

    public primaryArray() {
        return this.form.get('primaryFeatures') as FormArray;
    }

    public secondaryArray() {
        return this.form.get('secondaryFeatures') as FormArray;
    }
}
