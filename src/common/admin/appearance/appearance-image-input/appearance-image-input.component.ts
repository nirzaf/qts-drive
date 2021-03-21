import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {AppearanceEditor} from '@common/admin/appearance/appearance-editor/appearance-editor.service';
import {UploadQueueService} from '@common/uploads/upload-queue/upload-queue.service';
import {AppearanceImageUploadValidator} from '@common/admin/appearance/appearance-image-input/appearance-image-upload-validator';
import {Settings} from '@common/core/config/settings.service';
import {openUploadWindow} from '@common/uploads/utils/open-upload-window';
import {UploadInputTypes} from '@common/uploads/upload-input-config';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {randomString} from '@common/core/utils/random-string';
import {finalize} from 'rxjs/operators';
import { UploadUri } from '@common/uploads/types/upload-uri.enum';
import {UploadApiConfig} from '@common/uploads/types/upload-api-config';

@Component({
    selector: 'appearance-image-input',
    templateUrl: './appearance-image-input.component.html',
    styleUrls: ['./appearance-image-input.component.scss'],
    host: {'tabindex': '0'},
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [UploadQueueService, {
        provide: NG_VALUE_ACCESSOR,
        useExisting: AppearanceImageInputComponent,
        multi: true,
    }]
})
export class AppearanceImageInputComponent implements ControlValueAccessor {
    @Input() defaultValue: string;
    @Input() backendUri: string;
    @Input() diskPrefix: string;
    private propagateChange: Function;
    public image$ = new BehaviorSubject(null);
    public loading$ = new BehaviorSubject<boolean>(false);

    constructor(
        private editor: AppearanceEditor,
        private uploadQueue: UploadQueueService,
        private validator: AppearanceImageUploadValidator,
        public settings: Settings,
    ) {
        this.validator.showToast = true;
    }

    public openModal() {
        const params: UploadApiConfig = {
            uri: this.backendUri || UploadUri.Image,
            httpParams: {diskPrefix: this.diskPrefix},
            validator: this.validator,
        };
        openUploadWindow({types: [UploadInputTypes.image]}).then(files => {
            this.loading$.next(true);
            this.uploadQueue.start(files, params)
                .pipe(finalize(() => this.loading$.next(false)))
                .subscribe(response => {
                    this.updateValue(response.fileEntry.url);
                });
        });
    }

    public remove() {
        this.updateValue(null);
    }

    public useDefault() {
        this.updateValue(this.defaultValue);
    }

    private updateValue(value?: string) {
        this.propagateChange(value);
        // make sure new image is loaded by browser as path will be the same
        this.image$.next(value + `?v=${randomString(8)}`);
    }

    public writeValue(value: string) {
        this.image$.next(value);
    }

    public registerOnChange(fn: Function) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {}
}
