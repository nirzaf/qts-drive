export const groupBy = function<T>(array: object[], key: string): {[key: string]: T[]} {
    return array.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {}) as {[key: string]: T[]};
};

