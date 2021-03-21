import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { SUPPORTED_ENTRY_TYPES } from '../../../entries/supported-entry-types';
import { kebabCase } from '@common/core/utils/kebab-case';

@Component({
    selector: 'file-icon',
    templateUrl: './file-icon.component.html',
    styleUrls: ['./file-icon.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileIconComponent implements OnChanges {
    @Input() type: string;
    @Input() mime: string;

    ngOnChanges() {
        if ( ! this.type && this.mime) {
            this.type = this.mime.split('/')[0];
        }
        if ( ! SUPPORTED_ENTRY_TYPES.includes(this.type)) {
            this.type = 'default';
        }
    }

    public getType() {
        return kebabCase(this.type);
    }
}
