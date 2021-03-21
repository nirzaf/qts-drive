/**
 * Sort array based on another array.
 */
export function mapOrder(array: any[], order: any[], key: string) {
    if ( ! array) return array;
    array.sort((a, b) => {
        const A = a[key], B = b[key];

        if (order.indexOf(A) > order.indexOf(B)) {
            return 1;
        } else {
            return -1;
        }
    });

    return array;
}
