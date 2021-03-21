export function createSelectorBox(): HTMLDivElement {
    const el = document.createElement('div');
    el.classList.add('selected-el-box');
    document.body.appendChild(el);
    return el;
}
