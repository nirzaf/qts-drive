import {User} from '@common/core/types/models/User';

export interface CustomPage {
    id: number;
    title?: string;
    body: string;
    slug: string;
    type: string;
    user?: User;
    hide_nav: boolean;
    created_at?: string;
    updated_at?: string;
}
