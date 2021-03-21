import { CountryData } from '../../../types/site-analytics-data';
import {ChartType, PieChartConfig} from '@common/shared/charts/base-chart';

export function transformCountryData(countriesData: CountryData[] = []): PieChartConfig {
    return {
        selector: '.countries-chart',
        type: ChartType.PIE,
        tooltip: 'Number of sessions',
        labels: countriesData.map(data => data.country),
        data: countriesData.map(data => data.sessions),
        options: {
            showLabel: true,
            donut: true,
        }
    };
}
