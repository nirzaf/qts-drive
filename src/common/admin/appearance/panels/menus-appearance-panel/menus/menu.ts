import {MenuItem} from '@common/core/ui/custom-menu/menu-item';

export class Menu {
    name: string;
    position = 'header';
    items: MenuItem[] = [];

    constructor(params: Object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}
