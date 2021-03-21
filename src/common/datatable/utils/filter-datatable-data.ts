import {Model} from '../../core/types/models/model';

export function filterDatatableData<T extends Model>(data: T[], filter: string): T[] {
    return data.filter(obj => filterPredicate(obj, filter));
}
/**
 * Checks if a data object matches the data source's filter string. By default, each data object
 * is converted to a string of its properties and returns true if the filter has
 * at least one occurrence in that string. By default, the filter string has its whitespace
 * trimmed and the match is case-insensitive. May be overridden for a custom implementation of
 * filter matching.
 * @param data Data object used to check against the filter.
 * @param filter Filter string that has been set on the data source.
 * @returns Whether the filter matches against the data
 */
function filterPredicate(data: object, filter: string): boolean {
    // Transform the data into a lowercase string of all property values.
    const dataStr = objectToStr(data);

    // Transform the filter by converting it to lowercase and removing whitespace.
    const transformedFilter = filter.trim().toLowerCase();

    return dataStr.indexOf(transformedFilter) !== -1;
}

export function objectToStr(obj: object) {
    return Object.keys(obj).reduce((currentTerm: string, key: string) => {
        // Use an obscure Unicode character to delimit the words in the concatenated string.
        // This avoids matches where the values of two columns combined will match the user's query
        // (e.g. `Flute` and `Stop` will match `Test`). The character is intended to be something
        // that has a very low chance of being typed in by somebody in a text field. This one in
        // particular is "White up-pointing triangle with dot" from
        // https://en.wikipedia.org/wiki/List_of_Unicode_characters
        const term = (obj[key] && typeof obj[key] === 'object') ?
            objectToStr(obj[key]) :
            obj[key];
        return currentTerm + term + '◬';
    }, '').toLowerCase();
}
