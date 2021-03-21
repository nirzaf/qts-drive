/**
 * Creates a RegExp from the given string, converting asterisks
 * to .* expressions, and escaping all other characters.
 */
export function stringsMatch(pattern: string, string: string): boolean {
    return new RegExp('^' + pattern.split(/\*+/).map(regExpEscape).join('.*') + '$').test(string);
}

/**
 * RegExp-escapes all characters in the given string.
 */
function regExpEscape (s) {
    return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}
