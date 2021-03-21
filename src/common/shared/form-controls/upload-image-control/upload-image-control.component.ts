import {Component, EventEmitter, HostBinding, Input, Output, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {UploadedFile} from '@common/uploads/uploaded-file';
import {UploadQueueService} from '@common/uploads/upload-queue/upload-queue.service';
import {UploadInputConfig, UploadInputTypes} from '@common/uploads/upload-input-config';
import {AppearanceImageUploadValidator} from '@common/admin/appearance/appearance-image-input/appearance-image-upload-validator';
import {UploadUri} from '@common/uploads/types/upload-uri.enum';
import {UploadApiConfig} from '@common/uploads/types/upload-api-config';
import {UploadsApiService} from '@common/uploads/uploads-api.service';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {openUploadWindow} from '../../../uploads/utils/open-upload-window';
import {MatMenuTrigger} from '@angular/material/menu';

@Component({
    selector: 'upload-image-control',
    templateUrl: './upload-image-control.component.html',
    styleUrls: ['./upload-image-control.component.scss'],
    providers: [UploadQueueService, {
        provide: NG_VALUE_ACCESSOR,
        useExisting: UploadImageControlComponent,
        multi: true,
    }]
})
export class UploadImageControlComponent implements ControlValueAccessor {
    @Output() fileDeleted = new EventEmitter();
    @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;
    @Input() defaultBackground: string;
    @Input() buttonText = 'Upload image';
    @Input() uploadConfig: UploadApiConfig;
    @Input() diskPrefix: string;
    @Input() @HostBinding('class.compact') compact = false;
    public uploadInputConfig: UploadInputConfig = {multiple: false, types: [UploadInputTypes.image]};
    public src$ = new BehaviorSubject<string>(null);
    private propagateChange: Function;

    constructor(
        private uploadQueue: UploadQueueService,
        private imageValidator: AppearanceImageUploadValidator,
        private uploadsApi: UploadsApiService,
        private http: AppHttpClient,
    ) {}

    public writeValue(value: string) {
        this.src$.next(value);
    }

    public registerOnChange(fn: Function) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {}

    public uploadImage(files: UploadedFile[]) {
        this.uploadQueue.start(files, this.uploadConfig || this.defaultUploadConfig())
            .subscribe(response => {
                this.src$.next(response.fileEntry.url);
                this.propagateChange(response.fileEntry.url);
            });
    }

    public deleteUpload() {
        const params = {paths: [this.src$.value], deleteForever: true};
        const request = this.uploadConfig && this.uploadConfig.uri ?
            this.http.delete(this.uploadConfig.uri, params) :
            this.uploadsApi.delete(params);

        request.subscribe(() => {
            this.src$.next(null);
            this.propagateChange(null);
            this.fileDeleted.emit();
        });
    }

    private defaultUploadConfig(): UploadApiConfig {
        return {
            httpParams: {diskPrefix: this.diskPrefix || 'common_media'},
            uri: UploadUri.Image,
            validator: this.imageValidator,
        };
    }

    public openUploadDialog() {
        if (this.src$.value) {
            this.menuTrigger.toggleMenu();
        } else {
            openUploadWindow(this.uploadInputConfig).then(files => {
                this.uploadImage(files);
            });
        }
    }
}
