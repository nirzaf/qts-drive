import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Settings} from '@common/core/config/settings.service';
import {AnalyticsChannel} from '@common/core/config/app-config';

@Component({
    selector: 'analytics-host',
    templateUrl: './analytics-host.component.html',
    styleUrls: ['./analytics-host.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsHostComponent implements OnInit, OnDestroy {
    public channels: AnalyticsChannel[] = [];

    constructor(
        public settings: Settings,
    ) {}

    ngOnInit() {
        this.channels = (this.settings.get('vebto.admin.analytics.channels', []) as AnalyticsChannel[])
            .filter(channel => {
                return !channel.condition || this.settings.get(channel.condition);
            });
    }

    ngOnDestroy() {
        const tooltipEl = document.querySelector('.chartist-tooltip');
        if (tooltipEl) {
            tooltipEl.remove();
        }
    }
}
