export class MenuItem {
    id: number|string;
    label: string;
    action: string;

    // ID for model if action matches to specific model. If action
    // points to a specific custom page, model_id will be that page's ID.
    model_id: number;
    type: 'page' | 'link' | 'route' = 'link';
    icon: string;
    condition: MenuItemCondition = null;
    target: string = null;
    activeExact = false;

    constructor(params: Partial<MenuItem> = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
        this.id = Math.floor(Math.random() * (1000 - 1));
    }
}

export type MenuItemCondition = string|string[]|Function;
