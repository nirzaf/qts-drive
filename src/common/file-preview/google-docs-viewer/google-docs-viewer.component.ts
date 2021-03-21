import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { BaseFilePreview } from '../base-file-preview';
import { BehaviorSubject } from 'rxjs';
import { GenericBackendResponse } from '@common/core/types/backend-response';
import { isAbsoluteUrl } from '@common/core/utils/is-absolute-url';

@Component({
    selector: 'google-docs-viewer',
    templateUrl: './google-docs-viewer.component.html',
    styleUrls: ['./google-docs-viewer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleDocsViewerComponent extends BaseFilePreview implements AfterViewInit {
    @ViewChild('iframe') iframe: ElementRef<HTMLIFrameElement>;
    public loading$ = new BehaviorSubject(true);
    public showDefaultPreview$ = new BehaviorSubject(false);
    private timeoutRef: any;

    ngAfterViewInit() {
        // google docs viewer only supports files up to 25MB
        if (this.file.file_size > 25000000) {
            return this.showDefaultPreview();
        }

        this.iframe.nativeElement.onload = () => {
            clearTimeout(this.timeoutRef);
            this.stopLoading();
        };

        this.getIframeSrc().then(url => {
            this.iframe.nativeElement.src = url;
        }).catch(() => {
            this.showDefaultPreview();
        });

        // if preview iframe is not loaded
        // after 5 seconds, bail and show default preview
        this.timeoutRef = setTimeout(() => {
            this.showDefaultPreview();
        }, 5000);
    }

    public stopLoading() {
        this.loading$.next(false);
    }

    public showDefaultPreview() {
        this.stopLoading();
        this.showDefaultPreview$.next(true);
    }

    public openInNewWindow() {
        window.open(window.location.href, '_blank');
    }

    private getIframeSrc(): Promise<string> {
        return new Promise((resolve, reject) => {
            let previewUrl = this.getSrc();

            // if we're not trying to preview shareable link we will need to generate
            // preview token, otherwise google won't be able to access this file
            if (previewUrl.indexOf('shareable_link') === -1) {
                this.http.post<GenericBackendResponse<{preview_token: string}>>(`uploads/${this.file.id}/add-preview-token`).subscribe(response => {
                    previewUrl += `?preview_token=${response.preview_token}`;
                    resolve(this.getFullPreviewUrl(previewUrl));
                }, () => reject);
            } else {
                resolve(this.getFullPreviewUrl(previewUrl));
            }
        });
    }

    private getFullPreviewUrl(previewUrl: string) {
        // https://docs.google.com/gview?embedded=true&url=
        previewUrl = isAbsoluteUrl(previewUrl) ? previewUrl : this.settings.getBaseUrl() + previewUrl;
        return 'https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(previewUrl);
    }
}
