import {Injectable} from '@angular/core';
import {Plan} from '@common/core/types/models/Plan';
import {BehaviorSubject} from 'rxjs';
import { CurrentUser } from '@common/auth/current-user';

@Injectable({
    providedIn: 'root'
})
export class SubscriptionStepperState {
    public mode: 'pricing'|'subscribe'|'changePlan';

    /**
     * Stripe.js instance.
     */
    public stripe: stripe.Stripe;

    /**
     * All available plans.
     */
    public plans: Plan[] = [];

    /**
     * Model for plan period radio group.
     */
    public radioGroupModel: number;

    /**
     * Base plan, selected in the first step.
     */
    public initialPlan$ = new BehaviorSubject<Plan>(null);

    /**
     * Final billing plan user has selected (base or yearly alternative)
     */
    public selectedPlan$ = new BehaviorSubject<Plan>(null);

    constructor(private currentUser: CurrentUser) {
        // if user was subscribed by admin from admin area, they will not have
        // any payment methods attached so we'll need to show payment panel as well
        this.mode = this.currentUser.isSubscribed() && this.currentUser.getSubscription().gateway !== 'none'  ? 'changePlan' : 'subscribe';
    }

    /**
     * Select initial "base" plan.
     */
    public selectInitialPlan(plan: Plan) {
        this.initialPlan$.next(plan);

        const children = this.getChildPlans(plan);

        if (children && children[0]) {
            this.radioGroupModel = children[0].id;
            this.selectedPlan$.next(children[0]);
        } else {
            this.selectedPlan$.next(plan);
            this.radioGroupModel = plan.id;
        }
    }

    /**
     * Select plan by specified ID.
     */
    public selectPlanById(id: number) {
        this.selectedPlan$.next(this.plans.find(plan => plan.id === id));
    }

    /**
     * Get different versions of specified plan.
     * (yearly, weekly, every 2 years etc)
     */
    public getChildPlans(parent: Plan) {
        return this.plans.filter(plan => plan.parent_id === parent.id && !plan.hidden);
    }

    /**
     * Set all available plans.
     */
    public setPlans(plans: Plan[]) {
        this.plans = plans;
    }
}
