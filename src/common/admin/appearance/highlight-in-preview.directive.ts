import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {AppearanceEditor} from '@common/admin/appearance/appearance-editor/appearance-editor.service';

@Directive({
    selector: '[highlightInPreview]'
})
export class HighlightInPreviewDirective implements OnInit {
    @Input('highlightInPreview') selector: string;

    constructor(
        private el: ElementRef<HTMLElement>,
        private editor: AppearanceEditor,
    ) {}

    public ngOnInit(): void {
        this.el.nativeElement.addEventListener('focus', () => {
            this.editor.selectNode(this.selector);
        });

        this.el.nativeElement.addEventListener('blur', () => {
            this.editor.deselectNode();
        });
    }
}
