/**
 * Convert specified string to snake_case
 */
export function snakeCase(string: string) {
    return string
        .replace(/\s/g, '_')
        .replace(/\.?([A-Z]+)/g, (x, y) => '_' + y)
        .replace(/^_/, '')
        .toLowerCase();
}
