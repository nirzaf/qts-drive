import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AudioPreviewComponent} from '../audio-preview/audio-preview.component';

@Component({
    selector: 'video-preview',
    templateUrl: './video-preview.component.html',
    styleUrls: ['./video-preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoPreviewComponent extends AudioPreviewComponent {
}
