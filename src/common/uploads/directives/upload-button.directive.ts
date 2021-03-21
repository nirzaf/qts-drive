import { Directive, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { openUploadWindow } from '../utils/open-upload-window';
import { UploadInputConfig } from '../upload-input-config';
import {UploadedFile} from '@common/uploads/uploaded-file';

@Directive({
    selector: '[uploadButton]'
})
export class UploadButtonDirective implements OnInit {
    @Input('uploadButton') config: UploadInputConfig = {};
    @Output() filesSelected = new EventEmitter<UploadedFile[]>();

    constructor(private el: ElementRef) {}

    ngOnInit() {
        this.el.nativeElement.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();

            openUploadWindow(this.config).then(files => {
                if (files && files.length) {
                    this.filesSelected.emit(files);
                }
            });
        });
    }
}
