import {Permission} from '@common/core/types/models/permission';

export interface Plan {
    id: number;
    name: string;
    amount: number;
    currency: string;
    currency_symbol: string;
    interval: 'day'|'week'|'month'|'year';
    interval_count: number;
    parent_id: number;
    parent?: Plan;
    permissions: Permission[];
    recommended: boolean;
    show_permissions: boolean;
    free: boolean;
    hidden: boolean;
    position: number;
    features: string[];
    available_space: number;
    updated_at: string;
}
