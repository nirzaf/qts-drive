import {ChangeDetectionStrategy, Component, ElementRef, OnInit} from '@angular/core';
import {Settings} from '@common/core/config/settings.service';

@Component({
    selector: 'accepted-payments-header',
    templateUrl: './accepted-payments-header.component.html',
    styleUrls: ['./accepted-payments-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptedPaymentsHeaderComponent implements OnInit {
    public acceptedCards: string[] = [];

    constructor(public settings: Settings, public el: ElementRef) {}

    ngOnInit() {
        this.acceptedCards = this.settings.getJson('billing.accepted_cards', []);
    }

    public getCardIcon(card: string) {
        return this.settings.getAssetUrl() + 'images/billing/' + card.toLowerCase() + '.png';
    }
}
