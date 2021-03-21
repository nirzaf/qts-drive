import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { UploadQueueService } from '@common/uploads/upload-queue/upload-queue.service';
import { UploadQueueItem } from '@common/uploads/upload-queue/upload-queue-item';
import { Store } from '@ngxs/store';
import { CloseUploadsPanel } from '../../state/actions/commands';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'uploads-panel',
    templateUrl: './uploads-panel.component.html',
    styleUrls: ['./uploads-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadsPanelComponent implements OnDestroy {
    public minimized$ = new BehaviorSubject(false);

    constructor(
        private store: Store,
        public activeUploads: UploadQueueService,
    ) {
    }

    ngOnDestroy() {
        this.activeUploads.reset();
    }

    public toggleMinimized() {
        this.minimized$.next(!this.minimized$.value);
    }

    public close() {
        this.store.dispatch(new CloseUploadsPanel());
    }

    public trackById(index: number, upload: UploadQueueItem) {
        return upload.id;
    }
}
