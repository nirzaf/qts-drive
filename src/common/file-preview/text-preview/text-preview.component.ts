import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {BaseFilePreview} from '../base-file-preview';

const FIVE_MB = 5242880;

@Component({
    selector: 'text-preview',
    templateUrl: './text-preview.component.html',
    styleUrls: ['./text-preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextPreviewComponent extends BaseFilePreview implements OnInit {
    public content$ = new BehaviorSubject('');
    public fileTooLarge$ = new BehaviorSubject(false);

    ngOnInit() {
        if (this.file.file_size > FIVE_MB) {
            this.fileTooLarge$.next(true);
        } else {
            this.loadFileContents();
        }
    }

    private loadFileContents() {
        this.getContents()
            .subscribe(content => {
                this.content$.next(content);
            });
    }
}
