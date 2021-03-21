import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SubscriptionStepperState} from '@common/billing/subscriptions/subscription-stepper-state.service';

@Component({
    selector: 'order-summary',
    templateUrl: './order-summary.component.html',
    styleUrls: ['./order-summary.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderSummaryComponent {
    constructor(public state: SubscriptionStepperState) {}
}
