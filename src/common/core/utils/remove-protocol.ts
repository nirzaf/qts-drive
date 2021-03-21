export function removeProtocol(url: string) {
    return url.replace(/(^\w+:|^)\/\//, '');
}
