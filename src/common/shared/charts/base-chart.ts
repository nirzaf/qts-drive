import {IBarChartOptions, IChartistData, ILineChartOptions, IPieChartOptions} from 'chartist';

export enum ChartType {
    LINE = 'line',
    PIE = 'pie',
    BAR = 'bar',
}

interface BaseChartConfig {
    selector?: string|HTMLElement;
    type: ChartType;
    labels: string[];
    legend?: boolean;
    tooltip?: string;
    data: number[][]|number[];
}

export interface BarChartConfig extends BaseChartConfig {
    type: ChartType.BAR;
    options?: IBarChartOptions;
    data: number[][];
}

export interface LineChartConfig extends BaseChartConfig {
    type: ChartType.LINE;
    options?: ILineChartOptions;
    data: number[][];
}

export interface PieChartConfig extends BaseChartConfig {
    type: ChartType.PIE;
    options?: IPieChartOptions;
    data: number[];
}

export abstract class BaseChart<T extends BaseChartConfig> {
    constructor(protected config: T) {
        setTimeout(() => this.generate());
    }

    protected abstract generate();

    protected abstract transformChartData(): IChartistData;

    protected getMaxValue(): number {
        if ( ! this.config.data) {
            return 0;
        }
        if (Array.isArray(this.config.data[0])) {
            return Math.max(...this.config.data[0] as number[], ...(this.config.data[1] || []) as number[]);
        } else {
            return Math.max(...this.config.data as number[]);
        }
    }

    protected generateDataWithTooltip(data: number[]): any {
        if (this.config.tooltip) {
            return data.map(value => {
                return {value, meta: this.config.tooltip};
            });
        } else {
            return data;
        }
    }

    public isEmpty(): boolean {
        return this.getMaxValue() <= 0;
    }

    public abstract destroy();
}
