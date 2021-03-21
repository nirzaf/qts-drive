export class SelectionModel<T> {
    private readonly selected = [];

    constructor(initialValues: T[], private readonly key: string|'id') {
        this.selected = [...initialValues];
        this.key = key || 'id';
    }

    public isSelected(item: T): boolean {
        return this.findIndex(item) > -1;
    }

    public toggle(item: T) {
        const i = this.findIndex(item);
        if (i > -1) {
            this.selected.splice(i, 1);
        } else {
            this.selected.push({...item});
        }
    }

    public updateValue(newValue: T) {
        const i = this.findIndex(newValue);
        this.selected[i] = {...newValue};
    }

    public getValue(key: number|string): T {
        return this.selected.find(item => item[this.key] === key);
    }

    public values(): T[] {
        return [...this.selected];
    }

    private findIndex(item: T): number {
        return this.selected.findIndex(p => p[this.key] === item[this.key]);
    }
}
