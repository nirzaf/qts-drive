import { Pipe, PipeTransform } from '@angular/core';
import { prettyBytes } from '../core/utils/pretty-bytes';

@Pipe({
    name: 'formattedFileSize',
    pure: true,
})
export class FormattedFileSizePipe implements PipeTransform {
    transform(bytes: number = 0, precision?: number|string): string {
        if (isNaN(parseFloat(String(bytes))) || ! isFinite(bytes)) return '-';
        return prettyBytes(bytes, precision);
    }
}
