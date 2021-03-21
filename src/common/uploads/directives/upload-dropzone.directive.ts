import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { openUploadWindow } from '../utils/open-upload-window';
import { UploadedFile } from '../uploaded-file';
import { readUploadedFolders } from '../utils/read-uploaded-folders';
import { UploadInputConfig } from '@common/uploads/upload-input-config';

@Directive({
    selector: '[fileDropzone]',
})
export class UploadDropzoneDirective implements OnInit, OnDestroy {
    @Input() disableDropzoneClick = false;
    @Input() disableDropzone = false;
    @Input() clickButton: ElementRef;
    @Input('fileDropzone') uploadConfig: UploadInputConfig = {};
    @Output() filesDropped: EventEmitter<UploadedFile[]> = new EventEmitter();

    constructor(protected el: ElementRef) {}

    ngOnInit() {
        const el = this.el.nativeElement;
        el.addEventListener('dragenter', (e) => this.handleDragEnter(e));
        el.addEventListener('dragover', (e) => this.handleDragOver(e));
        el.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        el.addEventListener('drop', (e) => this.handleDrop(e));

        if ( ! this.disableDropzoneClick) {
            const trigger = this.clickButton ? this.clickButton.nativeElement : el;
            trigger.addEventListener('click', () => this.handleClick());
        }
    }

    ngOnDestroy() {
        this.removeClassesFromDropzone();
    }

    protected handleClick() {
        if (this.disableDropzone) return;
        openUploadWindow(this.uploadConfig).then(files => {
            this.emitUploadEvent(files);
        });
    }

    public handleDragEnter(e) {
        if (this.dropzoneDisabled(e)) return;
        this.el.nativeElement.classList.add('file-over-dropzone');
    }

    public handleDragOver(e) {
        if (e.preventDefault) e.preventDefault();
        e.dataTransfer.dropEffect = this.dropzoneDisabled(e) ? 'none' : 'move';
        return false;
    }

    public handleDragLeave(e: MouseEvent) {
        const newEl = document.elementFromPoint(e.clientX, e.clientY);
        if (this.el.nativeElement.contains(newEl)) return;
        this.removeClassesFromDropzone();
    }

    public async handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        this.removeClassesFromDropzone();
        if (this.dropzoneDisabled(e) || !e.dataTransfer.items) return;

        const items = Array.from(e.dataTransfer.items)
            .filter((item: DataTransferItem) => item.kind === 'file')
            .map((item: DataTransferItem) => {
                return item.webkitGetAsEntry();
            });

        if (items.length) {
            this.emitUploadEvent(await readUploadedFolders(items));
        }
    }

    protected emitUploadEvent(files: UploadedFile[]) {
        this.filesDropped.emit(files);
    }

    protected removeClassesFromDropzone() {
        this.el.nativeElement.classList.remove('file-over-dropzone');
    }

    protected dropzoneDisabled(e: DragEvent) {
        const hasFiles = e.dataTransfer.types.find(type => type.toLowerCase() === 'files');
        return this.disableDropzone || ! hasFiles;
    }
}
