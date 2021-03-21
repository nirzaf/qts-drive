import {Pipe, PipeTransform} from '@angular/core';
import {getFaviconFromUrl} from '@common/core/utils/get-favicon-from-url';

@Pipe({
    name: 'favicon'
})
export class FaviconPipe implements PipeTransform {
    transform(url: string): string {
        if (!url) {
            return null;
        }
        if (url.includes('youtube')) {
            return 'https://www.youtube.com/s/desktop/ca54e1bd/img/favicon.ico';
        } else {
            return getFaviconFromUrl(url);
        }
    }
}
