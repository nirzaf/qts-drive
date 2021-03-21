import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Plan} from '@common/core/types/models/Plan';

@Component({
    selector: 'plan-features-list',
    templateUrl: './plan-features-list.component.html',
    styleUrls: ['./plan-features-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanFeaturesListComponent {
    @Input() plan: Plan;
    @Input() showCheckIcons = false;
    @Input() dense = false;

    public getPlan() {
        return this.plan.parent || this.plan;
    }
}
