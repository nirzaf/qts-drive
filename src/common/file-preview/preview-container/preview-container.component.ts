import {ChangeDetectionStrategy, Component, ComponentRef, Input, OnChanges, OnDestroy} from '@angular/core';
import {FileEntry} from '../../uploads/types/file-entry';
import {PreviewFilesService} from '../preview-files.service';
import {BaseFilePreview} from '../base-file-preview';
import {Subscription} from 'rxjs';

@Component({
    selector: 'preview-container',
    templateUrl: './preview-container.component.html',
    styleUrls: ['./preview-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewContainerComponent implements OnChanges, OnDestroy {
    @Input() files: FileEntry[];
    @Input() activeFile: number;
    @Input() disableDownload = false;
    private downloadSub: Subscription;

    constructor(public previewFiles: PreviewFilesService) {}

    ngOnChanges(changes) {
        this.previewFiles.set(this.files, this.activeFile);
    }

    ngOnDestroy() {
        this.previewFiles.destroy();
        if (this.downloadSub) this.downloadSub.unsubscribe();
    }

    public listenForDownloadClick(comp: ComponentRef<BaseFilePreview>) {
        if (this.downloadSub) this.downloadSub.unsubscribe();
        if ( ! this.disableDownload) {
            this.downloadSub = comp.instance.download.subscribe(() => {
                this.previewFiles.download.next();
            });
        }
    }
}
