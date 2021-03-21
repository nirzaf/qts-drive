export function scrollInvalidInputIntoView(errors: {[key: string]: any}, prefix = '') {
    let firstKey = Object.keys(errors)[0];
    if (firstKey) {
        if (prefix) {
            firstKey = `${prefix}-${firstKey}`;
        }
        const node = document.getElementById(firstKey);
        if (node) {
            node.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});
        }
    }
}
