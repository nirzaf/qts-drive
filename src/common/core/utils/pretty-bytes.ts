import { spaceUnits } from './space-units';

export function prettyBytes(bytes: number, precision?: number|string): string|null {
    if (isNaN(parseFloat(String(bytes))) || ! isFinite(bytes)) return null;

    let unitKey = 0;
    while (bytes >= 1024) {
        bytes /= 1024;
        unitKey ++;
    }

    let unit = spaceUnits[unitKey];

    if ( ! precision) {
        precision = getPrecision(unit);
    }

    if (unit === 'bytes' && bytes < 2) {
        unit = 'byte';
    }

    return parseFloat(bytes.toFixed(+precision).toString()).toString() + ' ' + unit;
}

function getPrecision(unit: string): number {
    switch (unit) {
        case 'MB':
            return 1;
        case 'GB':
        case 'TB':
        case 'PB':
            return 2;
        default:
            return 0;
    }
}
