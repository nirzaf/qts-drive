export function extensionFromFilename(fullFileName: string) {
    const re = /(?:\.([^.]+))?$/;
    return re.exec(fullFileName)[1];
}
