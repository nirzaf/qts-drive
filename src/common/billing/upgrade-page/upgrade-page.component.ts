import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionStepperState } from '../subscriptions/subscription-stepper-state.service';
import { Settings } from '../../core/config/settings.service';
import { Toast } from '../../core/ui/toast.service';
import { Subscriptions } from '../../shared/billing/subscriptions.service';
import { BehaviorSubject } from 'rxjs';
import { LocalStorage } from '@common/core/services/local-storage.service';
import { Plan } from '@common/core/types/models/Plan';
import { finalize } from 'rxjs/operators';
import { CurrentUser } from '@common/auth/current-user';
import { PaypalSubscriptions } from '@common/billing/subscriptions/paypal-subscriptions';

export interface CreditCard {
    number?: number|string;
    expiration_month?: number|string;
    expiration_year?: number|string;
    security_code?: number|string;
}

enum Steps {
    Plans = 0,
    Period = 1,
    Payment = 2
}

interface LocalStorageState {
    initial?: number;
    final?: number;
}

export const ONBOARDING_LOCAL_STORAGE_KEY = 'be.onboarding.selected';

@Component({
    selector: 'upgrade-page',
    templateUrl: './upgrade-page.component.html',
    styleUrls: ['./upgrade-page.component.scss'],
    providers: [SubscriptionStepperState],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpgradePageComponent implements OnInit {
    @ViewChild(MatStepper, { static: true }) stepper: MatStepper;
    @Input() set mode(value: 'pricing'|'subscribe'|'changePlan') {
        this.state.mode = value;
    }
    public loading$ = new BehaviorSubject<boolean>(false);

    constructor(
        private subscriptions: Subscriptions,
        private route: ActivatedRoute,
        public settings: Settings,
        private router: Router,
        private toast: Toast,
        public state: SubscriptionStepperState,
        private localStorage: LocalStorage,
        private currentUser: CurrentUser,
        private paypalSubscriptions: PaypalSubscriptions,
    ) {}

    ngOnInit() {
        this.route.data.subscribe((data: {plans: Plan[]}) => {
            this.state.setPlans(data.plans);
            if (this.state.mode === 'subscribe') {
               this.hydrateStateFromLocalStorage();
            }
        });
    }

    private hydrateStateFromLocalStorage() {
        const storedState = this.localStorage.get(ONBOARDING_LOCAL_STORAGE_KEY) as LocalStorageState;
        if (storedState && storedState.initial && storedState.final) {
            const initialPlan = this.state.plans.find(p => p.id === storedState.initial),
                finalPlan = this.state.plans.find(p => p.id === storedState.final);
            if (initialPlan && finalPlan) {
                this.state.selectInitialPlan(initialPlan);
                this.state.selectPlanById(finalPlan.id);
                this.stepper.selectedIndex = Steps.Payment;
            }
        }
    }

    public nextStep() {
        // User is changing their plan, there's no need to get their payment information
        if (this.state.mode === 'changePlan' && this.stepper.selectedIndex === Steps.Period) {
            this.changePlan();
        // User has selected free plan in pricing page. Redirect them to sign-up page
        } else if (this.state.mode === 'pricing' && this.state.selectedPlan$.value.free && this.stepper.selectedIndex === Steps.Plans) {
            this.router.navigate(['register']);
        // User has selected paid plan on pricing page, but have not signed up yet,
        // store selected plan data in local storage and redirect to sign-up page
        } else if (this.state.mode === 'pricing' && this.stepper.selectedIndex === Steps.Period) {
            this.localStorage.set(ONBOARDING_LOCAL_STORAGE_KEY, {
                initial: this.state.initialPlan$.value.id,
                final: this.state.selectedPlan$.value.id
            });
            this.router.navigate(['register']);
        // Continue to next subscription flow step
        } else {
            this.stepper.next();
        }
    }

    public onCompleted() {
        this.loading$.next(false);
        this.router.navigate(['/']);
        this.localStorage.remove(ONBOARDING_LOCAL_STORAGE_KEY);
        this.toast.open({
            message: 'Subscribed to ":planName" plan successfully.',
            replacements: {planName: this.getSelectedOrParentPlanName()},
        });
    }

    /**
     * Change user's active subscription plan to specified one.
     */
    public changePlan() {
        const plan = this.state.selectedPlan$.value,
            activeSubscription = this.currentUser.getSubscription();
        // user already subscribed
        if (this.currentUser.getSubscription({planId: plan.id})) {
            return;
        }
        this.loading$.next(true);
        if (activeSubscription.gateway === 'paypal') {
            this.paypalSubscriptions.changePlan(activeSubscription, plan).then(user => {
                this.loading$.next(false);
                this.currentUser.assignCurrent(user);
                this.router.navigate(['/billing/subscription']);
                this.toast.open('Subscription plan changed.');
            });
        } else {
            this.subscriptions.changePlan(activeSubscription.id, plan)
                .pipe(finalize(() => this.loading$.next(false)))
                .subscribe(response => {
                    this.currentUser.assignCurrent(response['user']);
                    this.router.navigate(['/billing/subscription']);
                    this.toast.open('Subscription plan changed.');
                });
        }
    }

    private getSelectedOrParentPlanName(): string {
        const selectedPlan = this.state.selectedPlan$.value;
        const plan = selectedPlan.parent ? selectedPlan.parent : selectedPlan;
        return plan.name;
    }
}
