import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Plan} from '@common/core/types/models/Plan';
import {Translations} from '@common/core/translations/translations.service';
import {ucFirst} from '@common/core/utils/uc-first';

@Component({
    selector: 'full-plan-name',
    template: '{{getFullPlanName()}}',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullPlanNameComponent {
    @Input() plan: Plan;

    constructor(private i18n: Translations) {}

    public getFullPlanName(): string {
        if ( ! this.plan) return;
        let name = this.plan.parent ? this.plan.parent.name : this.plan.name;
        name = ucFirst(this.i18n.t(name));
        name += ' ' + this.i18n.t('Plan');
        if (this.plan.parent) name += ': ' + this.plan.name;
        return name;
    }
}
