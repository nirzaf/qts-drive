import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SubscriptionStepperState } from '../../subscriptions/subscription-stepper-state.service';
import { Plan } from '@common/core/types/models/Plan';

@Component({
    selector: 'select-plan-period-panel',
    templateUrl: './select-plan-period-panel.component.html',
    styleUrls: ['./select-plan-period-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectPlanPeriodPanelComponent {
    @Input() showSidebar = false;
    @Output() selected = new EventEmitter();

    constructor(
        public state: SubscriptionStepperState,
    ) {}

    public getPlanSavings(base: Plan, parent: Plan): number {
        const baseAmount = this.getAmountPerDay(base);
        const amount = this.getAmountPerDay(parent);
        const savings = (baseAmount - amount) / baseAmount * 100;
        return Math.ceil(savings);
    }

    private getAmountPerDay(plan: Plan) {
        let days = 1;
        if (plan.interval === 'week') {
            days = 7;
        } else if (plan.interval === 'month') {
            days = 30;
        } else if (plan.interval === 'year') {
            days = 365;
        }
        days = days * plan.interval_count;
        return plan.amount / days;
    }

    public getAmountForSingleInterval(plan: Plan) {
        return plan.amount / plan.interval_count;
    }
}
