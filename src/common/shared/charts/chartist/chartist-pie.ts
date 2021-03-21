import Chartist from 'chartist';
import {IChartistPieChart, IPieChartOptions} from 'chartist';
import ChartistTooltip from 'chartist-plugin-tooltips-updated';
import {BaseChart, PieChartConfig} from '@common/shared/charts/base-chart';

export class ChartistPie extends BaseChart<PieChartConfig> {
    protected pieConfig: IPieChartOptions = {
        showLabel: false,
        chartPadding: 0,
        plugins: [
            ChartistTooltip(),
        ]
    };

    protected chart: IChartistPieChart;

    protected generate() {
        const options =  {
            ...this.pieConfig,
            ...this.config.options || {},
        };
        this.chart = new Chartist.Pie(
            this.config.selector,
            this.transformChartData(),
            options,
        );
        this.animate();
    }

    protected transformChartData() {
        return {
            labels: this.config.labels,
            series: this.generateDataWithTooltip(this.config.data),
        };
    }

    public destroy() {
        if (this.chart) {
            this.chart.off('draw');
            this.chart.detach();
        }
    }

    protected animate() {
        this.chart.on('draw', data => {
            if (data.type === 'slice') {
                const pathLength = data.element._node.getTotalLength();
                data.element.attr({
                    'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
                });
                const animationDefinition = {
                    'stroke-dashoffset': {
                        id: 'anim' + data.index,
                        dur: 300 * data.value / data.totalDataSum,
                        from: -pathLength + 'px',
                        to: '0px',
                        fill: 'freeze'
                    }
                };
                if (data.index !== 0) {
                    animationDefinition['stroke-dashoffset']['begin'] = 'anim' + (data.index - 1) + '.end';
                }
                data.element.attr({
                    'stroke-dashoffset': -pathLength + 'px'
                });
                data.element.animate(animationDefinition, false);
                if (data.endAngle === 360) {
                    let index = data.index;
                    let dur = 1000 * data.value / data.totalDataSum / 2;
                    let from = 0;
                    let to = -pathLength / 3;
                    for (let i = 0; i < 4; i++) {
                        data.element.animate({
                            'stroke-dashoffset': {
                                id: 'anim' + (index + 1),
                                dur: dur,
                                from: from + 'px',
                                to: to + 'px',
                                fill: 'freeze',
                                begin: 'anim' + index + '.end'
                            }
                        }, false);
                        index++;
                        dur /= 1.75;
                        const t = from;
                        from = to;
                        to = t / 2.5;
                    }
                }
            }
        });
    }
}
