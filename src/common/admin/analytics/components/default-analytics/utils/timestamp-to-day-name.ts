export function timestampToDayName(timestamp: number, locale: string = 'en-US') {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(locale, {weekday: 'short'});
}
