import copy from 'copy-to-clipboard';

export function copyToClipboard(url: string) {
    return copy(url);
}
