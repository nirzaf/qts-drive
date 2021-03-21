export function hasKey<K extends string>(key: K, val: any): val is {[P in K]: any} {
    return key in val;
}
