export function stripTags(string: string): string {
    return string.replace(/(<([^>]+)>)/ig, '');
}
