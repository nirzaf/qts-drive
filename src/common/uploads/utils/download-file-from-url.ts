/**
 * Download file from specified url.
 */
export function downloadFileFromUrl(url: string, name?: string) {
    const link = document.createElement('a');
    link.href = url;
    if (name) link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
