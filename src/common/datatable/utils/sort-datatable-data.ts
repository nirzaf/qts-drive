import * as Dot from "dot-object";
import {_isNumberValue} from '@angular/cdk/coercion';
import {Model} from '@common/core/types/models/model';

const MAX_SAFE_INTEGER = 9007199254740991;

export function sortDatatableData<T extends Model>(data: T[], orderBy: string, orderDir: string): T[] {
    return data.sort((a, b) => {
        let valueA = sortingDataAccessor(a, orderBy);
        let valueB = sortingDataAccessor(b, orderBy);

        // If there are data in the column that can be converted to a number,
        // it must be ensured that the rest of the data
        // is of the same type so as not to order incorrectly.
        const valueAType = typeof valueA;
        const valueBType = typeof valueB;

        if (valueAType !== valueBType) {
            if (valueAType === 'number') {
                valueA += '';
            }
            if (valueBType === 'number') {
                valueB += '';
            }
        }

        // If both valueA and valueB exist (truthy), then compare the two. Otherwise, check if
        // one value exists while the other doesn't. In this case, existing value should come last.
        // This avoids inconsistent results when comparing values to undefined/null.
        // If neither value exists, return 0 (equal).
        let comparatorResult = 0;
        if (valueA != null && valueB != null) {
            // Check if one value is greater than the other; if equal, comparatorResult should remain 0.
            if (valueA > valueB) {
                comparatorResult = 1;
            } else if (valueA < valueB) {
                comparatorResult = -1;
            }
        } else if (valueA != null) {
            comparatorResult = 1;
        } else if (valueB != null) {
            comparatorResult = -1;
        }

        return comparatorResult * (orderDir === 'asc' ? 1 : -1);
    });
}

/**
 * Data accessor function that is used for accessing data properties for sorting through
 * the default sortData function.
 * This default function assumes that the sort header IDs (which defaults to the column name)
 * matches the data's properties (e.g. column Xyz represents data['Xyz']).
 * May be set to a custom function for different behavior.
 */
function sortingDataAccessor(data: object, sortHeaderId: string): string {
    const value = Dot.pick(sortHeaderId, data);

    if (_isNumberValue(value)) {
        const numberValue = Number(value);

        // Numbers beyond `MAX_SAFE_INTEGER` can't be compared reliably so we
        // leave them as strings. For more info: https://goo.gl/y5vbSg
        return numberValue < MAX_SAFE_INTEGER ? numberValue : value;
    }

    // if (Array.isArray(value)) {
    //     return value.reduce((prev, curr) => prev += objectToStr(curr));
    // }

    return value;
}
