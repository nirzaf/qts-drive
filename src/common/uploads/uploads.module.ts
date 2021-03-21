import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {UploadButtonDirective} from './directives/upload-button.directive';
import {UploadDropzoneDirective} from './directives/upload-dropzone.directive';
import {UploadProgressBarComponent} from './upload-progress-bar/upload-progress-bar.component';

@NgModule({
    imports: [
        CommonModule,

        // material
        MatButtonModule,
        MatProgressBarModule,
        MatIconModule,
    ],
    declarations: [
        UploadDropzoneDirective,
        UploadButtonDirective,
        UploadProgressBarComponent,
    ],
    exports: [
        UploadDropzoneDirective,
        UploadButtonDirective,
        UploadProgressBarComponent,
    ],
})
export class UploadsModule {
}
