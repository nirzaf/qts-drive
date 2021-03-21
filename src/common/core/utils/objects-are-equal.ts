import {arraysAreEqual} from './arrays-are-equal';

export function objectsAreEqual(a: object, b: object, strict = true): boolean {
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);

    if (aProps.length !== bProps.length) {
        return false;
    }

    for (let i = 0; i < aProps.length; i++) {
        const propName = aProps[i];
        const propA = a[propName];
        const propB = b[propName];

        // variable types must match
        if (propA && propB && typeof propA == 'object' && typeof propB == 'object') {
            if (propA.constructor !== propB.constructor) return false;

            // compare arrays
            if (propA.constructor === Array) {
                return arraysAreEqual(a[propName], b[propName]);
            }
        }

        // If values of same property are not equal, objects are not equivalent
        if (strict) {
            if (propA !== propB) return false;
        } else {
            if (propA != propB) return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}
