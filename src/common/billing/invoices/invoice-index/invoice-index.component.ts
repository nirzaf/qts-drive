import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {InvoiceService} from '@common/billing/invoices/invoice.service';
import {Invoice} from '@common/billing/invoices/invoice';
import {BehaviorSubject} from 'rxjs';
import {Settings} from '@common/core/config/settings.service';
import {finalize} from 'rxjs/operators';
import {CurrentUser} from '@common/auth/current-user';

@Component({
    selector: 'invoice-index',
    templateUrl: './invoice-index.component.html',
    styleUrls: ['./invoice-index.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceIndexComponent implements OnInit {
    public invoices$ = new BehaviorSubject<Invoice[]>([]);
    public loading$ = new BehaviorSubject<boolean>(false);

    constructor(
       private invoices: InvoiceService,
       public settings: Settings,
       private currentUser: CurrentUser,
    ) {}

    ngOnInit() {
        this.loading$.next(true);
        this.invoices.index({userId: this.currentUser.get('id')})
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.invoices$.next(response.invoices);
            });
    }

    public getInvoiceUrl(invoice: Invoice) {
        return this.settings.getBaseUrl(true) + 'secure/billing/invoice/' + invoice.uuid;
    }
}
