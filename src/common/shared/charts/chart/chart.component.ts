import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {BarChartConfig, BaseChart, ChartType, LineChartConfig, PieChartConfig} from '@common/shared/charts/base-chart';
import {ChartistLine} from '@common/shared/charts/chartist/chartist-line';
import {ChartistPie} from '@common/shared/charts/chartist/chartist-pie';
import {ChartistBar} from '@common/shared/charts/chartist/chartist-bar';

type ChartConfig = BarChartConfig|LineChartConfig|PieChartConfig;

@Component({
    selector: 'chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'chart'},
})
export class ChartComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('headerWrapper', {static: true}) headerWrapper: ElementRef<HTMLElement>;
    @ViewChild('legendWrapper', {static: true}) legendWrapper: ElementRef<HTMLElement>;
    @ViewChild('chartPlaceholder', { static: true }) chartPlaceholder: ElementRef<HTMLElement>;

    @Input() chartConfig: ChartConfig;
    @Input() height: number;
    public chart: BaseChart<ChartConfig>;

    constructor(protected el: ElementRef<HTMLElement>) {}

    ngOnInit() {
        this.calcAndSetChartHeight();
    }

    ngOnChanges() {
        if ( ! this.chartConfig) return;
        if (this.chartConfig.type === ChartType.LINE) {
            this.chart = new ChartistLine(this.transformConfig() as LineChartConfig);
        } else if (this.chartConfig.type === ChartType.BAR) {
            this.chart = new ChartistBar(this.transformConfig() as BarChartConfig);
        } else {
            this.chart = new ChartistPie(this.transformConfig() as PieChartConfig);
        }
    }

    ngOnDestroy() {
        if ( ! this.chart) return;
        this.chart.destroy();
    }

    private transformConfig(): ChartConfig {
        return {
            ...this.chartConfig,
            selector: this.chartPlaceholder.nativeElement
        };
    }

    private calcAndSetChartHeight() {
        let innerHeight = this.height;
        const headerMargin = 15;
        if (this.headerWrapper.nativeElement.children.length) {
            innerHeight -= 66; // header height
        }
        if ((this.chartConfig && this.chartConfig.legend) || this.legendWrapper.nativeElement.children.length) {
            innerHeight -= 40; // legend height
        }
        this.el.nativeElement.style.height = this.height + 'px';
        this.chartPlaceholder.nativeElement.style.height = (innerHeight - headerMargin) + 'px';
    }
}
