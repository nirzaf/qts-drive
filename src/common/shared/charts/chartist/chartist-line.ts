import Chartist from 'chartist';
import ChartistTooltip from 'chartist-plugin-tooltips-updated';
import {IChartistLineChart, ILineChartOptions} from 'chartist';
import {BaseChart, LineChartConfig} from '@common/shared/charts/base-chart';

export class ChartistLine extends BaseChart<LineChartConfig> {
    protected lineConfig: ILineChartOptions = {
        showArea: true,
        lineSmooth: true,
        low: 0,
        fullWidth: true,
        chartPadding: {
            left: 15,
            right: 30,
        },
        axisY: {
            // 0,454 => 0,4 when displaying chart with no data
            labelInterpolationFnc: (val) => Math.floor(val)
        },
        plugins: [
            ChartistTooltip(),
        ]
    };

    protected chart: IChartistLineChart;

    protected generate() {
        const lineConfig = {
            ...this.lineConfig,
            high: this.getHigh(),
            ...(this.config.options || {})
        };
        this.chart = new Chartist.Line(
            this.config.selector,
            this.transformChartData(),
            lineConfig,
        );

        this.chart.on('draw', data =>  {
            if (data.type === 'line' || data.type === 'area') {
                data.element.animate({
                    d: {
                        begin: data.index,
                        dur: 250,
                        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                        to: data.path.clone().stringify(),
                        easing: Chartist.Svg.Easing.easeOutQuint
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
