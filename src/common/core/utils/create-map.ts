export function createMap<K extends string|number, V extends {id: number|string}>(items: V[]): Map<K, V> {
    return new Map((items || []).map(item => [item.id, item])) as Map<K, V>;
}
