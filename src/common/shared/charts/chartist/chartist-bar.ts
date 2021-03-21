import Chartist from 'chartist';
import ChartistTooltip from 'chartist-plugin-tooltips-updated';
import {IBarChartOptions, IChartistBarChart} from 'chartist';
import {BarChartConfig, BaseChart} from '@common/shared/charts/base-chart';

export class ChartistBar extends BaseChart<BarChartConfig> {
    protected barConfig: IBarChartOptions = {
        chartPadding: {
            left: 15,
            right: 30,
        },
        plugins: [
            ChartistTooltip(),
        ]
    };

    protected chart: IChartistBarChart;

    protected generate() {
        const barConfig: IBarChartOptions = {
            ...this.barConfig,
            ...(this.config.options || {}),
            high: this.getHigh(),
        };
        this.chart = new Chartist.Bar(
            this.config.selector,
            this.transformChartData(),
            barConfig,
        );
        this.chart.on('draw', function(data) {
            if (data.type === 'bar') {
                data.element.animate({
                    y2: {
                        dur: '0.2s',
                        from: data.y1,
                        to: data.y2
                    }
                });
            }
        });
    }

    protected transformChartData() {
        return {
            labels: this.config.labels,
            series: this.config.data.map(d => this.generateDataWithTooltip(d || [])),
        };
    }

    protected getHigh() {
        // if chart data is empty, show 0-100 in Y axis
        return this.getMaxValue() ? undefined : 100;
    }

    public destroy() {
        if (this.chart) {
            this.chart.off('draw');
            this.chart.detach();
        }
    }
}
