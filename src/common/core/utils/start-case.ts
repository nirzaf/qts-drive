export function startCase(text: string) {
    return text.replace(/([A-Z])/g, ' $1');
}
