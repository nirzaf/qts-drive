import { WeeklyPageViews } from '../../../types/site-analytics-data';
import { timestampToDayName } from '../utils/timestamp-to-day-name';
import {ChartType, LineChartConfig} from '@common/shared/charts/base-chart';

export function transformWeeklyData(weeklyPageViews: WeeklyPageViews): LineChartConfig {
    const config = {
        type: ChartType.LINE,
        labels: [],
        tooltip: 'Pageviews',
        data: [[], []]
    } as LineChartConfig;

    weeklyPageViews?.current?.forEach((dayData, key) => {
        config.labels.push(timestampToDayName(dayData.date));

        // current week data
        config.data[0].push(dayData.pageViews);

        // previous week data
        config.data[1].push(weeklyPageViews.previous[key]?.pageViews || 0);
    });

    return config;
}
