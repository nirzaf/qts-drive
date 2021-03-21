export function strContains(haystack: string | string[], needle: string): boolean {
    if (!haystack || !needle) return false;

    needle = needle.toLowerCase();

    if (!Array.isArray(haystack)) {
        haystack = [haystack];
    }

    for (let i = 0; i < haystack.length; i++) {
        if (haystack[i].toLowerCase().indexOf(needle) > -1) return true;
    }

    return false;
}
