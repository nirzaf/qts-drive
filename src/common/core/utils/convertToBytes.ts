type UNITS = 'KB'|'MB'|'GB'|'TB'|'PB';

export function convertToBytes(value: number, unit: UNITS) {
    if (value === null) return null;
    switch (unit) {
        case 'KB':
            return value * 1024;
        case 'MB':
            return value * Math.pow(1024, 2);
        case 'GB':
            return value * Math.pow(1024, 3);
        case 'TB':
            return value * Math.pow(1024, 4);
        case 'PB':
            return value * Math.pow(1024, 5);
        default:
            return value;
    }
}
