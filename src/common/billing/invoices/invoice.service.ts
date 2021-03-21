import {Injectable} from '@angular/core';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {BackendResponse} from '@common/core/types/backend-response';
import {Invoice} from '@common/billing/invoices/invoice';

const BASE_URI = 'billing/invoice';

@Injectable({
    providedIn: 'root'
})
export class InvoiceService {
    constructor(private http: AppHttpClient) {
    }

    public index(params: {userId?: number} = {}): BackendResponse<{invoices: Invoice[]}> {
        return this.http.get(`${BASE_URI}`, params);
    }
}
