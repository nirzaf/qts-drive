import {ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef} from '@angular/core';
import {CustomDomain} from '../../custom-domain';

@Component({
    selector: 'custom-domain-table',
    templateUrl: './custom-domain-table.component.html',
    styleUrls: ['./custom-domain-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomDomainTableComponent {
    @Input() domains: CustomDomain[] = [];
    @Input() showOwnerColumn = false;
    @Input() showGlobalColumn = false;
    @ContentChild('editButton') editButtonTemplate: TemplateRef<CustomDomain>;
}
