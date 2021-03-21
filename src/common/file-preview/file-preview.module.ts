import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TextPreviewComponent} from './text-preview/text-preview.component';
import {AVAILABLE_PREVIEWS, DefaultPreviews} from './available-previews';
import {PreviewContainerComponent} from './preview-container/preview-container.component';
import {PortalModule} from '@angular/cdk/portal';
import {VideoPreviewComponent} from './video-preview/video-preview.component';
import {ImagePreviewComponent} from './image-preview/image-preview.component';
import {PdfPreviewComponent} from './pdf-preview/pdf-preview.component';
import {DefaultPreviewComponent} from './default-preview/default-preview.component';
import {MatButtonModule} from '@angular/material/button';
import {AudioPreviewComponent} from './audio-preview/audio-preview.component';
import {GoogleDocsViewerComponent} from './google-docs-viewer/google-docs-viewer.component';
import {LoadingIndicatorModule} from '@common/core/ui/loading-indicator/loading-indicator.module';
import {OverlayPanel} from '@common/core/ui/overlay-panel/overlay-panel.service';
import {PreviewFilesService} from '@common/file-preview/preview-files.service';

@NgModule({
    imports: [
        CommonModule,

        // material
        PortalModule,
        MatButtonModule,
        LoadingIndicatorModule,
    ],
    exports: [
        PreviewContainerComponent,
    ],
    declarations: [
        PreviewContainerComponent,
        TextPreviewComponent,
        VideoPreviewComponent,
        ImagePreviewComponent,
        PdfPreviewComponent,
        DefaultPreviewComponent,
        AudioPreviewComponent,
        GoogleDocsViewerComponent
    ],
    providers: [
        OverlayPanel,
        PreviewFilesService,
        {provide: AVAILABLE_PREVIEWS, useClass: DefaultPreviews},
    ]
})
export class FilePreviewModule {
}
