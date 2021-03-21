export function arrayToObject(array: object[]): {[key: string]: any} {
    return array.reduce((previous, current) => {
        return {...previous, ...current};
    });
}
