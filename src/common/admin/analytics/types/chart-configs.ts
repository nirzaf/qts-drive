import {LineChartConfig, PieChartConfig} from '@common/shared/charts/base-chart';

export interface ChartConfigs {
    weeklyPageViews: LineChartConfig;
    monthlyPageViews: LineChartConfig;
    countries: PieChartConfig;
    browsers: PieChartConfig;
}
