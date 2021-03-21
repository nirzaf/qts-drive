import { BrowserData } from '../../../types/site-analytics-data';
import {ChartType, PieChartConfig} from '@common/shared/charts/base-chart';

export function transformBrowserData(browserData: BrowserData[] = []): PieChartConfig {
    return {
        type: ChartType.PIE,
        tooltip: 'Number of sessions',
        labels: browserData.map(data => data.browser),
        data: browserData.map(data => data.sessions),
        legend: false,
        options: {
            showLabel: true,
            donut: true,
        }
    };
}
