import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, OnDestroy } from '@angular/core';
import { UploadQueueService } from '../upload-queue/upload-queue.service';
import { animationFrameScheduler, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Component({
    selector: 'upload-progress-bar',
    templateUrl: './upload-progress-bar.component.html',
    styleUrls: ['./upload-progress-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadProgressBarComponent implements OnDestroy {
    @HostBinding('class.hidden') hidden = true;
    private subscription: Subscription;
    public progress: number;

    constructor(
        private el: ElementRef,
        public uploadQueue: UploadQueueService,
        private cd: ChangeDetectorRef,
    ) {
        this.subscription = this.uploadQueue.totalProgress()
            // material progress bar animation lasts 250ms
            .pipe(throttleTime(260, animationFrameScheduler, {leading: true, trailing: true}))
            .subscribe(progress => {
                this.progress = progress;
                this.hidden = progress === 100 || this.uploadQueue.count$.value.pending === 0;
                this.cd.markForCheck();
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}

