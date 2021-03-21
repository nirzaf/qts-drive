import {User} from '@common/core/types/models/User';

export interface CustomDomain {
    id: number;
    host: string;
    user_id: number;
    user?: User;
    global: boolean;
    created_at: string;
    updated_at: string;
    resource?: {[key: string]: any};
}
