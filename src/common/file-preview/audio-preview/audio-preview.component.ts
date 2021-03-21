import {ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BaseFilePreview} from '../base-file-preview';

@Component({
    selector: 'audio-preview',
    templateUrl: './audio-preview.component.html',
    styleUrls: ['./audio-preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudioPreviewComponent extends BaseFilePreview implements OnInit {
    @ViewChild('playerEl', { static: true }) playerEl: ElementRef;
    public invalidMedia = false;

    ngOnInit() {
        this.invalidMedia = !this.canPlayVideo();

        if ( ! this.invalidMedia) {
            const source = document.createElement('source');
            source.src = this.getSrc();
            source.type = this.file.mime;
            this.player().appendChild(source);
            this.player().play();
        }
    }

    protected canPlayVideo(): boolean {
        return !!this.player().canPlayType(this.file.mime);
    }

    protected player() {
        return this.playerEl.nativeElement as HTMLVideoElement|HTMLAudioElement;
    }
}
