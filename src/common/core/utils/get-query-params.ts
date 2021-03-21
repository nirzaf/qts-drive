export function getQueryParams(url: string): { [key: string]: string } {
    if (url.indexOf('?') === -1) return;

    // prevent browser errors if only part of url
    // is give, for example "browse?type=movie"
    if (url.indexOf('//') === -1) {
        url = 'https://' + url;
    }

    const params = new URL(url).searchParams;

    const final = {};
    params.forEach((value, key) => {
        final[key] = value;
    });

    return final;
}
