export function selectNode(selector: string, index: number = 0, box: HTMLDivElement) {
    const el = document.querySelectorAll(selector)[index] as HTMLElement;
    if ( ! el) return;

    const rect = el.getBoundingClientRect();
    if ( ! rect.height) return;

    el.scrollIntoView({block: 'center', inline: 'center', behavior: 'smooth'});
    
    box.style.width = rect.width + 'px';
    box.style.height = rect.height + 'px';
    box.style.top = (document.documentElement.scrollTop + rect.top) + 'px';
    box.style.left = rect.left + 'px';
    box.style.borderRadius = el.style.borderRadius;
}
