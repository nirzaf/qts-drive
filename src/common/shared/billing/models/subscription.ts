import {Plan} from '@common/core/types/models/Plan';
import {User} from '@common/core/types/models/User';

export class Subscription {
    id: number;
    plan_id: number;
    user_id: number;
    on_grace_period?: boolean;
    gateway: string;
    gateway_id: string;
    valid?: boolean;
    cancelled?: boolean;
    on_trial?: boolean;
    plan?: Plan;
    trial_ends_at: string;
    ends_at: string;
    updated_at: string;
    created_at: string;
    description: string;
    renews_at: string;
    user?: User;

    constructor(params: Object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}
