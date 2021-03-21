import {ChangeDetectionStrategy, Component, HostBinding,} from '@angular/core';
import {BaseFilePreview} from '../base-file-preview';

@Component({
  selector: 'pdf-preview',
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdfPreviewComponent extends BaseFilePreview {
    @HostBinding('class') className = 'preview-object';

    public getSrc() {
        return super.getSrc() + '#toolbar=0';
    }
}
