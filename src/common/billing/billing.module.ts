import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UpgradePageComponent } from './upgrade-page/upgrade-page.component';
import { BillingPlansResolver } from './upgrade-page/billing-plans-resolver.service';
import { BillingRoutingModule } from './billing-routing.module';
import { PlanFeaturesListComponent } from './upgrade-page/plan-features-list/plan-features-list.component';
import { OrderSummaryComponent } from './upgrade-page/order-summary/order-summary.component';
import { AcceptedPaymentsHeaderComponent } from './upgrade-page/accepted-payments-header/accepted-payments-header.component';
import { UserSubscriptionPageComponent } from './subscriptions/user-subscription-page/user-subscription-page.component';
import { UpgradePageAsideComponent } from './upgrade-page/upgrade-page-aside/upgrade-page-aside.component';
import { CurrenciesListResolver } from './upgrade-page/currencies-list-resolver.service';
import { CreditCardFormComponent } from './credit-card-form/credit-card-form.component';
import { PaypalSubscriptions } from './subscriptions/paypal-subscriptions';
import { SelectPlanPanelComponent } from './plans/select-plan-panel/select-plan-panel.component';
import { SelectPlanPeriodPanelComponent } from './plans/select-plan-period-panel/select-plan-period-panel.component';
import { SubscriptionStepperState } from './subscriptions/subscription-stepper-state.service';
import { UserNotSubscribedGuard } from './guards/user-not-subscribed-guard.service';
import { UserSubscribedGuard } from './guards/user-subscribed-guard.service';
import { CreateSubscriptionPanelComponent } from './subscriptions/create-subscription-panel/create-subscription-panel.component';
import { ContactWidgetComponent } from './upgrade-page/contact-widget/contact-widget.component';
import { FullPlanNameModule } from '../shared/billing/full-plan-name/full-plan-name.module';
import { InvoiceIndexComponent } from '@common/billing/invoices/invoice-index/invoice-index.component';
import { PricingPageComponent } from './pricing-page/pricing-page.component';
import { MaterialNavbarModule } from '@common/core/ui/material-navbar/material-navbar.module';
import { TranslationsModule } from '@common/core/translations/translations.module';
import { FormatPipesModule } from '@common/core/ui/format-pipes/format-pipes.module';
import { NoResultsMessageModule } from '@common/core/ui/no-results-message/no-results-message.module';
import { LoadingIndicatorModule } from '@common/core/ui/loading-indicator/loading-indicator.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialNavbarModule,
        BillingRoutingModule,
        FullPlanNameModule,
        TranslationsModule,
        FormatPipesModule,
        NoResultsMessageModule,
        LoadingIndicatorModule,

        // material
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatDialogModule,
        MatStepperModule,
        MatProgressBarModule,
        MatTabsModule,
        MatRadioModule,
    ],
    declarations: [
        UpgradePageComponent,
        PlanFeaturesListComponent,
        OrderSummaryComponent,
        AcceptedPaymentsHeaderComponent,
        UserSubscriptionPageComponent,
        UpgradePageAsideComponent,
        CreditCardFormComponent,
        CreateSubscriptionPanelComponent,
        SelectPlanPanelComponent,
        SelectPlanPeriodPanelComponent,
        ContactWidgetComponent,
        InvoiceIndexComponent,
        PricingPageComponent,
    ],
    providers: [
        BillingPlansResolver,
        CurrenciesListResolver,
        PaypalSubscriptions,
        SubscriptionStepperState,
        SubscriptionStepperState,
        UserNotSubscribedGuard,
        UserSubscribedGuard,
    ],
    exports: [
        BillingRoutingModule,
    ]
})
export class BillingModule {
}
