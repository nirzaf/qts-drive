import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { UploadQueueItem, UploadQueueItemProgress } from '@common/uploads/upload-queue/upload-queue-item';
import { UploadQueueService } from '@common/uploads/upload-queue/upload-queue.service';
import { Store } from '@ngxs/store';
import { CloseUploadsPanel } from '../../../state/actions/commands';
import { throttleTime } from 'rxjs/operators';
import { animationFrameScheduler, Subscription } from 'rxjs';

@Component({
    selector: 'uploads-panel-item',
    templateUrl: './uploads-panel-item.component.html',
    styleUrls: ['./uploads-panel-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadsPanelItemComponent implements OnInit, OnDestroy {
    @Input() upload: UploadQueueItem;
    public progress: UploadQueueItemProgress = {};
    private subscription: Subscription;

    constructor(
        private uploadQueue: UploadQueueService,
        private store: Store,
        private cd: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.subscription = this.upload.progress$.pipe(
            // material progress bar animation lasts 250ms
            throttleTime(260, animationFrameScheduler, {leading: true, trailing: true}),
        ).subscribe(progress => {
            this.progress = progress;
            this.cd.detectChanges();
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    public cancelUpload(upload: UploadQueueItem) {
        this.uploadQueue.remove(upload.id);
        if (this.uploadQueue.isEmpty()) {
            this.store.dispatch(new CloseUploadsPanel());
        }
    }
}
