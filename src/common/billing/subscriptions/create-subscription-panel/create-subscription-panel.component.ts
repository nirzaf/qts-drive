import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Subscription} from '@common/shared/billing/models/subscription';
import {Plan} from '@common/core/types/models/Plan';
import {CreateSubOnStripeResponse, Subscriptions} from '@common/shared/billing/subscriptions.service';
import {CurrentUser} from '@common/auth/current-user';
import {PaypalSubscriptions} from '@common/billing/subscriptions/paypal-subscriptions';
import {Toast} from '@common/core/ui/toast.service';
import {Settings} from '@common/core/config/settings.service';
import {User} from '@common/core/types/models/User';
import {CreditCard} from '@common/billing/upgrade-page/upgrade-page.component';
import {BehaviorSubject} from 'rxjs';
import {SubscriptionStepperState} from '@common/billing/subscriptions/subscription-stepper-state.service';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';
import {HttpErrors} from '@common/core/http/errors/http-errors.enum';

export interface SubscriptionCompletedEvent {
    status: 'created'|'updated';
}

interface NewSubscriptionPayload {
    card?: CreditCard;
    start_date?: string;
    plan_id: number;
}

@Component({
    selector: 'create-subscription-panel',
    templateUrl: './create-subscription-panel.component.html',
    styleUrls: ['./create-subscription-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateSubscriptionPanelComponent {
    public loading$ = new BehaviorSubject<boolean>(false);
    public selectedIndex$ = new BehaviorSubject<number>(0);

    /**
     * Fired when subscription creation starts or ends.
     */
    @Output() loading = new EventEmitter<boolean>();

    /**
     * Text for submit purchase button.
     */
    @Input() submitText = 'Submit Purchase';

    /**
     * Whether paypal tab should be disabled.
     */
    @Input() disablePaypalTab = false;

    /**
     * We're changing user subscription from this one.
     * Used for prorating the new subscription start date.
     */
    @Input() from: Subscription;

    /**
     * Plan user should be subscribed to.
     */
    @Input() plan: Plan;

    /**
     * Fired when subscription is created or updated.
     */
    @Output() completed: EventEmitter<SubscriptionCompletedEvent> = new EventEmitter();

    constructor(
        private subscriptions: Subscriptions,
        private currentUser: CurrentUser,
        private paypal: PaypalSubscriptions,
        private toast: Toast,
        public settings: Settings,
        private state: SubscriptionStepperState,
    ) {}

    /**
     * Subscribe user to current plan on stripe gateway.
     */
    public subscribeOnStripe() {
        // if user is already subscribed to this plan, fire "updated" event and bail
        if (this.currentUser.getSubscription({gateway: 'stripe', planId: this.plan.id})) {
            return this.completed.emit({status: 'updated'});
        }

        this.startLoading();

        this.subscriptions.createOnStripe(this.getNewSubscriptionPayload())
            .subscribe(response => {
                if (response.status === 'complete') {
                    this.completeSubscription(response.user);
                } else {
                   this.confirmCardPayment(response);
                }
            }, (errResponse: BackendErrorResponse) => {
                const key = Object.keys(errResponse.errors)[0];
                this.toast.open(errResponse.errors[key] || HttpErrors.Default);
                this.stopLoading();
            });
    }

    /**
     * Confirm card payment via 3D secure.
     */
    private confirmCardPayment(response: CreateSubOnStripeResponse) {
        this.state.stripe.confirmCardPayment(response.payment_intent_secret)
            .then(result => {
                if (result.error) {
                    this.stopLoading();
                    this.toast.open('Card payment was not confirmed.', {action: 'Retry'})
                        .onAction()
                        .subscribe(() => {
                            this.confirmCardPayment(response);
                        });
                } else {
                    this.subscriptions.finalizeOnStripe(response.reference, response.user.id)
                        .subscribe(finalResponse => {
                            this.completeSubscription(finalResponse.user);
                        });
                }
            });
    }

    /**
     * Subscribe user to current plan on paypal gateway.
     */
    public subscribeOnPaypal() {
        // if user is already subscribed to this plan, fire "updated" event and bail
        if (this.currentUser.getSubscription({gateway: 'paypal', planId: this.plan.id})) {
            return this.completed.emit({status: 'updated'});
        }

        this.startLoading();

        this.paypal.subscribe(this.getNewSubscriptionPayload()).then(user => {
            this.completeSubscription(user);
            this.selectedIndex$.next(0);
        }).catch(message => {
            this.stopLoading();
            this.toast.open(message || 'There was an issue. Please try again later.');
        });
    }

    /**
     * Get payload for backend for creating a new subscription.
     */
    private getNewSubscriptionPayload(): NewSubscriptionPayload {
       const payload = {plan_id: this.plan.id};

       if (this.from) {
           payload['start_date'] = this.from.renews_at;
       }

       return payload;
    }

    private completeSubscription(user: User) {
        this.stopLoading();
        this.currentUser.assignCurrent(user);
        this.completed.emit({status: 'created'});
    }

    private startLoading() {
        this.loading$.next(true);
        this.loading.emit(true);
    }

    private stopLoading() {
        this.loading$.next(false);
        this.loading.emit(false);
    }
}
