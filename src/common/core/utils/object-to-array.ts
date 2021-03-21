export function objectToArray(obj: object): any[] {
    if ( ! obj) return [];
    return Object.keys(obj).map(key => {
        return obj[key];
    });
}

