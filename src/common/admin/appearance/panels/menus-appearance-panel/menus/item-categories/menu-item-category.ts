import {MenuItem} from '@common/core/ui/custom-menu/menu-item';

export interface MenuItemCategory {
    name: string;
    items: Partial<MenuItem>[];
}
