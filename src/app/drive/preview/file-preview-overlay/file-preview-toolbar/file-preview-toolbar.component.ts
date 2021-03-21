import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { PreviewFilesService } from '@common/file-preview/preview-files.service';
import { Settings } from '@common/core/config/settings.service';

@Component({
    selector: 'file-preview-toolbar',
    templateUrl: './file-preview-toolbar.component.html',
    styleUrls: ['./file-preview-toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilePreviewToolbarComponent {
    @Input() showLogo = false;
    @Input() disableDownload = false;
    @Input() showCloseButton = false;

    @Output() closed = new EventEmitter();

    constructor(
        public previewFiles: PreviewFilesService,
        public settings: Settings,
    ) {}

    public downloadFiles() {
        this.previewFiles.download.next();
    }
}
