import {isAbsoluteUrl} from '@common/core/utils/is-absolute-url';

export function getFaviconFromUrl(url: string) {
    if ( ! url) {
        return null;
    }
    // relative url to current site
    if ( ! isAbsoluteUrl(url)) {
        url = window.location.protocol + '//' + window.location.host;
    }
    const domain = new URL(url).origin;
    return 'https://www.google.com/s2/favicons?domain=' + domain;
}
