import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { finalize, share } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subscription } from '@common/shared/billing/models/subscription';
import { Settings } from '@common/core/config/settings.service';
import { Modal } from '@common/core/ui/dialogs/modal.service';
import { Subscriptions } from '@common/shared/billing/subscriptions.service';
import { CurrentUser } from '@common/auth/current-user';
import { Toast } from '@common/core/ui/toast.service';
import { Plan } from '@common/core/types/models/Plan';
import { ConfirmModalComponent } from '@common/core/ui/confirm-modal/confirm-modal.component';
import { SubscriptionCompletedEvent } from '@common/billing/subscriptions/create-subscription-panel/create-subscription-panel.component';
import { User } from '@common/core/types/models/User';

@Component({
    selector: 'user-subscription-page',
    templateUrl: './user-subscription-page.component.html',
    styleUrls: ['./user-subscription-page.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSubscriptionPageComponent implements OnInit {
    public loading$ = new BehaviorSubject<boolean>(false);
    public activeSubscription$ = new BehaviorSubject<Subscription>(null);

    constructor(
        public settings: Settings,
        private modal: Modal,
        private subscriptions: Subscriptions,
        public currentUser: CurrentUser,
        private toast: Toast,
    ) {}

    ngOnInit() {
        this.activeSubscription$.next(this.currentUser.getSubscription());
    }

    public canResume() {
        return this.currentUser.onGracePeriod();
    }

    public canCancel() {
        return this.currentUser.isSubscribed() && !this.currentUser.onGracePeriod();
    }

    public canChangePaymentMethod() {
        return this.settings.get('billing.stripe.enable') || this.settings.get('billing.paypal.enable');
    }

    public getFormattedEndDate(): string {
        if ( ! this.activeSubscription$.value.ends_at) return null;
        return this.activeSubscription$.value.ends_at.split(' ')[0];
    }

    public getFormattedRenewDate() {
        if ( ! this.activeSubscription$.value.renews_at) return null;
        return this.activeSubscription$.value.renews_at.split(' ')[0];
    }

    public getPlan(): Plan {
        return this.activeSubscription$.value.plan;
    }

    /**
     * Ask user to confirm deletion of selected templates
     * and delete selected templates if user confirms.
     */
    public maybeCancelSubscription() {
        this.modal.open(ConfirmModalComponent, {
            title: 'Cancel Subscription',
            body: 'Are you sure you want to cancel your subscription?',
            ok: 'Yes, Cancel',
            cancel: 'Go Back'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.cancelSubscription().subscribe(() => {
                this.toast.open('Subscription cancelled.');
            });
        });
    }

    /**
     * Resume cancelled subscription.
     */
    public resumeSubscription() {
        this.loading$.next(true);
        this.subscriptions.resume(this.activeSubscription$.value.id)
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.currentUser.setSubscription(response.subscription);
                this.activeSubscription$.next(this.currentUser.getSubscription());
                this.toast.open('Subscription resumed.');
            });
    }

    /**
     * Called after user payment method for active subscription has been changed successfully.
     */
    public onPaymentMethodChange(e: SubscriptionCompletedEvent) {
        // if we've only changed customer card information on same
        // payment gateway, show success message and bail
        if (e.status === 'updated') {
            this.toast.open('Payment method updated.');
            return;
        }

        this.loading$.next(true);

        // otherwise cancel user's subscription on the other gateway
        this.cancelSubscription({delete: true}).subscribe(() => {
            this.toast.open('Payment method updated.');
        });
    }

    /**
     * Cancel currently active user subscription.
     */
    private cancelSubscription(params: {delete?: boolean} = {}): Observable<{user: User}> {
        this.loading$.next(true);

        const request = this.subscriptions.cancel(this.activeSubscription$.value.id, {delete: params.delete})
            .pipe(finalize(() => this.loading$.next(false)))
            .pipe(share());

        request.subscribe(response => {
            // set new active subscription, if user had more then one
            this.updateUserAndSubscription(response.user);
        });

        return request;
    }

    /**
     * Update current user and active subscription.
     */
    private updateUserAndSubscription(user: User) {
        this.currentUser.assignCurrent(user);
        this.activeSubscription$.next(this.currentUser.getSubscription());
    }
}
