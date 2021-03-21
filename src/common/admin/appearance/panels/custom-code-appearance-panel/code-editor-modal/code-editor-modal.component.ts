import {ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {filter} from 'rxjs/operators';
import {ESCAPE} from '@angular/cdk/keycodes';
import {LazyLoaderService} from '@common/core/utils/lazy-loader.service';
import {BehaviorSubject} from 'rxjs';

declare let ace;

export interface CodeEditorModalData {
    contents?: string;
    language: string;
}

@Component({
    selector: 'code-editor-modal',
    templateUrl: './code-editor-modal.component.html',
    styleUrls: ['./code-editor-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeEditorModalComponent implements OnInit {
    @ViewChild('editor', { static: true }) editorEl: ElementRef;

    public loading$ = new BehaviorSubject<boolean>(false);
    public syntaxInvalid$ = new BehaviorSubject<boolean>(false);
    private editor;

    constructor(
        private dialogRef: MatDialogRef<CodeEditorModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CodeEditorModalData,
        private lazyLoader: LazyLoaderService,
    ) {}

    ngOnInit() {
        this.initEditor(this.data.contents, this.data.language);
        this.overrideDialogCloseEvents();
    }

    public confirm() {
        this.close(this.editor.getValue());
    }

    public close(value?: string) {
        this.dialogRef.close(value);
    }

    private initEditor(contents: string, language = 'html') {
        this.loading$.next(true);
        this.lazyLoader.loadAsset('js/ace/ace.js', {type: 'js'}).then(() => {
            this.editor = ace.edit(this.editorEl.nativeElement);
            this.editor.getSession().setMode('ace/mode/' + language);
            this.editor.setTheme('ace/theme/chrome');
            this.editor.$blockScrolling = Infinity;
            if (contents) this.editor.setValue(contents, 1);

            this.editor.getSession().on('changeAnnotation', () => {
                const annotations = this.editor.getSession().getAnnotations() as any[];

                // hide !doctype syntax error
                if (annotations[0] && /doctype first/.test(annotations[0].text)) {
                    annotations.splice(0, 1);
                    this.editor.getSession().setAnnotations(annotations);
                    return;
                }

                // prevent editor submit if there are syntax errors
                const syntaxInvalid = this.editor
                    .getSession()
                    .getAnnotations()
                    .filter(a => a.type === 'error')
                    .length > 0;
                this.syntaxInvalid$.next(syntaxInvalid);
            });
            this.loading$.next(false);
        });
    }

    /**
     * Need to always send dialog data, regardless of how it was closed.
     * Angular material does not provide easy way to do this, so
     * we need to override backdrop click and escape key close events.
     */
    private overrideDialogCloseEvents() {
        this.dialogRef.disableClose = true;

        // close on backdrop click
        this.dialogRef.backdropClick().subscribe(() => {
            this.close();
        });

        // close on escape key
        this.dialogRef.keydownEvents()
            .pipe(filter(event => event.keyCode === ESCAPE))
            .subscribe(() => this.close());
    }
}
