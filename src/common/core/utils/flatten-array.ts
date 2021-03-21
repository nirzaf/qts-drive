/**
 * Flatten specified array of arrays.
 */
export function flattenArray<T>(arrays: T[][]): T[] {
    return [].concat.apply([], arrays);
}
