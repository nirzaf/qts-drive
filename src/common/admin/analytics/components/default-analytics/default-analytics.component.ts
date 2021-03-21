import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {SiteAnalyticsData} from '@common/admin/analytics/types/site-analytics-data';
import {transformWeeklyData} from '@common/admin/analytics/components/default-analytics/transformers/weekly-data-transformer';
import {transformMonthlyData} from '@common/admin/analytics/components/default-analytics/transformers/monthly-data-transformer';
import {transformBrowserData} from '@common/admin/analytics/components/default-analytics/transformers/browser-data-transformer';
import {transformCountryData} from '@common/admin/analytics/components/default-analytics/transformers/country-data-transformer';
import {ChartConfigs} from '@common/admin/analytics/types/chart-configs';
import {ReplaySubject} from 'rxjs';
import {AnalyticsHeaderData, AnalyticsResponse} from '@common/admin/analytics/types/analytics-response';
import {HttpCacheClient} from '@common/core/http/http-cache-client';
import {finalize} from 'rxjs/operators';

@Component({
    selector: 'default-analytics',
    templateUrl: './default-analytics.component.html',
    styleUrls: ['./default-analytics.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultAnalyticsComponent implements OnInit {
    protected channel = 'default';
    public readonly chartHeight = 400;
    public headerData: AnalyticsHeaderData[];
    public loading$ = new ReplaySubject<boolean>(1);
    public charts: ChartConfigs;

    constructor(
        private http: HttpCacheClient
    ) {}

    ngOnInit() {
        this.loading$.next(true);
        this.http.get<AnalyticsResponse>('admin/analytics/stats', {channel: this.channel})
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.headerData = response.headerData;
                this.charts = this.generateCharts(response.mainData);
            });
    }

    private generateCharts(data: SiteAnalyticsData) {
        return {
            weeklyPageViews: transformWeeklyData(data.weeklyPageViews),
            monthlyPageViews: transformMonthlyData(data.monthlyPageViews),
            browsers: transformBrowserData(data.browsers),
            countries: transformCountryData(data.countries)
        };
    }
}
