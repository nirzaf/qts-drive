import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Plan} from '@common/core/types/models/Plan';

@Component({
    selector: 'upgrade-page-aside',
    templateUrl: './upgrade-page-aside.component.html',
    styleUrls: ['./upgrade-page-aside.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpgradePageAsideComponent {
    @Input() plan: Plan;
}
