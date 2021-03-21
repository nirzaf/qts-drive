import {Subscription} from '@common/shared/billing/models/subscription';

export interface Invoice {
    id: string;
    notes: string;
    subscription_id: number;
    subscription: Subscription;
    uuid: string;
    paid: boolean;
    created_at: string;
}
