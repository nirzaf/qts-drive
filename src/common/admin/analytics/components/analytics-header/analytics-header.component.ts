import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {AnalyticsHeaderData} from '../../types/analytics-response';

@Component({
    selector: 'analytics-header',
    templateUrl: './analytics-header.component.html',
    styleUrls: ['./analytics-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsHeaderComponent {
    @Input() data: AnalyticsHeaderData[];
}
