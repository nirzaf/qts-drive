import { EventEmitter, HostBinding, Inject, Directive } from '@angular/core';
import { CURRENT_PREVIEW_FILE } from './current-preview-file';
import { FileEntry } from '../uploads/types/file-entry';
import { PREVIEW_URL_TRANSFORMER, PreviewUrlTransformer } from './preview-url-transformer';
import { Settings } from '../core/config/settings.service';
import { Observable } from 'rxjs';
import { AppHttpClient } from '../core/http/app-http-client.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CurrentUser } from '../auth/current-user';

@Directive()
export abstract class BaseFilePreview {
    @HostBinding('class.file-preview-wrapper') filePreviewWrapper = true;
    public download = new EventEmitter();

    constructor(
        @Inject(CURRENT_PREVIEW_FILE) protected file: FileEntry,
        @Inject(PREVIEW_URL_TRANSFORMER) protected transformer: PreviewUrlTransformer,
        protected settings: Settings,
        protected http: AppHttpClient,
        protected sanitizer: DomSanitizer,
        protected currentUser: CurrentUser,
    ) {}

    public getSrc(): string {
        return `${this.transformer(this.file)}.${this.file.extension}`;
    }

    public getSafeSrc(): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getSrc());
    }

    public getContents(): Observable<string> {
        return this.http.get(this.getSrc(), null, {responseType: 'text'});
    }
}
