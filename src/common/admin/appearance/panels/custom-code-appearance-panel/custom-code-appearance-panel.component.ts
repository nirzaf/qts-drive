import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AppearanceEditor} from '@common/admin/appearance/appearance-editor/appearance-editor.service';
import {FormBuilder} from '@angular/forms';
import {CodeEditorModalComponent} from '@common/admin/appearance/panels/custom-code-appearance-panel/code-editor-modal/code-editor-modal.component';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {Toast} from '@common/core/ui/toast.service';
import {SetCustomCss, SetCustomHtml} from '@common/shared/appearance/commands/appearance-commands';

@Component({
    selector: 'custom-code-appearance-panel',
    templateUrl: './custom-code-appearance-panel.component.html',
    styleUrls: ['./custom-code-appearance-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomCodeAppearancePanelComponent implements OnInit {
    public form = this.fb.group({
        'custom-code.css': [''],
        'custom-code.html': [''],
    });

    constructor(
        public editor: AppearanceEditor,
        private fb: FormBuilder,
        private modal: Modal,
        private toast: Toast,
    ) {}

    ngOnInit() {
        const defaults = {};
        Object.keys(this.form.controls).forEach(key => {
            defaults[key] = this.editor.currentValue(key);
        });
        this.form.patchValue(defaults);
    }

    public openModal(type: 'css'|'html') {
        const key = 'custom-code.' + type;
        const initialValue = this.form.value[key] || '',
            params = {contents: this.form.value[key], language: type};
        this.modal.open(CodeEditorModalComponent, params)
            .afterClosed()
            .subscribe(value => {
                // undefined means user closed modal without clicking "update" button
                if (value === undefined || initialValue === value) return;
                const newValue = {[key]: value};
                this.form.patchValue(newValue);
                this.editor.saveChanges(newValue).subscribe(() => {
                    this.addCodeToPreview(type, value);
                    this.toast.open('Custom code saved');
                });
            });
    }

    private addCodeToPreview(type: 'css'|'html', content: string) {
        if (type === 'css') {
            this.editor.postMessage(new SetCustomCss(content));
        } else {
            this.editor.postMessage(new SetCustomHtml(content));
        }
    }
}
