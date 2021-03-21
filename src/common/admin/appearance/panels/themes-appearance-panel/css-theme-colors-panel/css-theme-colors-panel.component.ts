import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CssTheme, CssThemeColors} from '@common/core/types/models/CssTheme';
import {FormControl, FormGroup} from '@angular/forms';
import {SetColors} from '@common/shared/appearance/commands/appearance-commands';
import {AppearanceEditor, EditorChanges} from '@common/admin/appearance/appearance-editor/appearance-editor.service';
import {CssThemeService} from '@common/admin/appearance/panels/themes-appearance-panel/css-theme.service';

@Component({
    selector: 'css-theme-colors-panel',
    templateUrl: './css-theme-colors-panel.component.html',
    styleUrls: ['./css-theme-colors-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CssThemeColorsPanelComponent implements OnInit, OnDestroy {
    @Input() theme: CssTheme;
    public form = new FormGroup({});
    private colorCache: CssThemeColors = {};

    constructor(
        private editor: AppearanceEditor,
        private themes: CssThemeService,
    ) {}

    ngOnInit() {
        this.editor.setSaveRequest(this.saveColors.bind(this));

        // build form
        Object.entries(this.theme.colors).forEach(([name, color]) => {
            this.form.addControl(name, new FormControl(color));
        });

        this.editor.initiated$.subscribe(() => {
            this.setColors(this.theme.colors);
            this.form.valueChanges.subscribe((value: CssThemeColors) => {
                this.setColors(value);
                this.editor.addChanges({'colors': value});
            });
        });
    }

    ngOnDestroy() {
        this.editor.setSaveRequest(null);
    }

    private saveColors(payload: EditorChanges) {
        return this.themes.update(this.theme.id, payload);
    }

    private setColors(colors: CssThemeColors) {
        Object.entries(colors).forEach(([name, color]) => {
            // make sure we only set colors that actually changed
            // to keep performance as good as possible
            if (this.colorCache[name] !== color) {
                this.editor.postMessage(new SetColors(name, color));
                this.colorCache[name] = color;
            }
        });
    }

    public viewName(name: string) {
        return name.replace('be-', '').replace(/-/g, ' ');
    }
}
