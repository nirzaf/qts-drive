import { Component, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { DRIVE_UPLOAD_INPUT_CONFIG } from '../../upload-input-config';
import { UploadInputConfig } from '@common/uploads/upload-input-config';
import { Store } from '@ngxs/store';
import { UploadFiles } from '../../state/actions/commands';
import { openUploadWindow } from '@common/uploads/utils/open-upload-window';

@Component({
    selector: 'upload-dropzone',
    templateUrl: './upload-dropzone.component.html',
    styleUrls: ['./upload-dropzone.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadDropzoneComponent implements AfterViewInit {
    @ViewChild('clickTarget', { static: true }) clickTarget: ElementRef;

    constructor (
        private store: Store,
        @Inject(DRIVE_UPLOAD_INPUT_CONFIG) private uploadConfig: UploadInputConfig,
    ) {}

    ngAfterViewInit() {
        this.clickTarget.nativeElement.addEventListener('click', () => {
            openUploadWindow(this.uploadConfig).then(files => {
                this.store.dispatch(new UploadFiles(files));
            });
        });
    }
}
