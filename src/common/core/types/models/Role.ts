import {Permission} from '@common/core/types/models/permission';

export class Role {
    id: number;
    name: string;
    type: string;
    description: string;
    permissions?: Permission[];
    default: boolean;
    guests: boolean;
    created_at?: string;
    updated_at?: string;

    constructor(params: object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}
