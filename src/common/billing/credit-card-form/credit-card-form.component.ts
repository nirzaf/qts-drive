import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    NgZone,
    OnDestroy,
    Output
} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {User} from '../../core/types/models/User';
import {Settings} from '../../core/config/settings.service';
import {LazyLoaderService} from '../../core/utils/lazy-loader.service';
import {CurrentUser} from '../../auth/current-user';
import {Subscriptions} from '../../shared/billing/subscriptions.service';
import {Toast} from '../../core/ui/toast.service';
import {ThemeService} from '@common/core/theme.service';
import {BehaviorSubject} from 'rxjs';
import {SubscriptionStepperState} from '@common/billing/subscriptions/subscription-stepper-state.service';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';

@Component({
    selector: 'credit-card-form',
    templateUrl: './credit-card-form.component.html',
    styleUrls: ['./credit-card-form.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCardFormComponent implements OnDestroy, AfterViewInit {

    /**
     * Event fired when form is submitted and card is added successfully on active gateway.
     */
    @Output() created: EventEmitter<User> = new EventEmitter();

    /**
     * Display text for form submit button.
     */
    @Input() submitButtonText = 'Submit';

    /**
     * Whether form submit button should be shown.
     */
    @Input() showSubmitButton = true;

    /**
     * Whether order summary should be shown in the template.
     */
    @Input() showOrderSummary = false;

    public loading$ = new BehaviorSubject<boolean>(false);
    public error$ = new BehaviorSubject<string>(null);
    private stripeElements: stripe.elements.Element[] = [];

    constructor(
        private subscriptions: Subscriptions,
        private currentUser: CurrentUser,
        private settings: Settings,
        private zone: NgZone,
        private lazyLoader: LazyLoaderService,
        private toast: Toast,
        private theme: ThemeService,
        private state: SubscriptionStepperState,
    ) {
        this.resetForm();
    }

    ngAfterViewInit() {
        this.initStripe();
    }

    ngOnDestroy() {
        this.destroyStripe();
    }

    /**
     * Submit stripe elements credit card form.
     */
    public async submitForm() {
        this.loading$.next(true);

        const {token, error} = await this.state.stripe.createToken(this.stripeElements[0]);

        if (error) {
            this.error$.next(error.message);
            this.loading$.next(false);
        } else {
            this.addCardToUser(token);
        }
    }

    public addCardToUser(stripeToken: stripe.Token) {
        this.loading$.next(true);
        this.subscriptions.addCard(stripeToken.id)
            .pipe(finalize(() =>  this.loading$.next(false)))
            .subscribe(response => {
                this.resetForm();
                this.currentUser.assignCurrent(response.user);
                this.created.emit(response.user);
            }, (errResponse: BackendErrorResponse) => {
                this.error$.next(errResponse.message);
            });
    }

    /**
     * Initiate stripe elements credit card form.
     */
    private initStripe() {
        this.lazyLoader.loadAsset('https://js.stripe.com/v3', {type: 'js'}).then(() => {
            const fields = ['cardNumber', 'cardExpiry', 'cardCvc'] as stripe.elements.elementsType[];
            this.state.stripe = Stripe(this.settings.get('billing.stripe_public_key'));
            const elements = this.state.stripe.elements();

            const isDarkMode = this.theme.selectedTheme$.value.is_dark;
            fields.forEach(field => {
                const el = elements.create(field, {classes: {base: 'base'}, style: {base: {color: isDarkMode ? '#fff' : 'inherit'}}});
                el.mount('#' + field);
                el.on('change', this.onChange.bind(this));
                this.stripeElements.push(el);
            });
        });
    }

    /**
     * Destroy all stripe elements instances.
     */
    private destroyStripe() {
        this.stripeElements.forEach(el => {
            el.unmount();
            el.destroy();
        });
    }

    /**
     * Fired on stripe element "change" event.
     */
    private onChange(change: stripe.elements.ElementChangeResponse) {
        this.zone.run(() => {
            this.error$.next(change.error ? change.error.message : null);
        });
    }

    /**
     * Reset credit card form.
     */
    private resetForm() {
        this.error$.next(null);
    }
}
