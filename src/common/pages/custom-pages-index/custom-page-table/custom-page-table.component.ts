import {ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef} from '@angular/core';
import {CustomPage} from '../../../core/types/models/CustomPage';
import {Settings} from '../../../core/config/settings.service';

@Component({
    selector: 'custom-page-table',
    templateUrl: './custom-page-table.component.html',
    styleUrls: ['./custom-page-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomPageTableComponent {
    @Input() pages: CustomPage[] = [];
    @Input() showOwnerColumn = false;
    @Input() showTypeColumn = false;
    @ContentChild('editButton') editButtonTemplate: TemplateRef<CustomPage>;

    constructor(private settings: Settings) {}

    public getPageUrl(page: CustomPage): string {
        return this.settings.getBaseUrl() + 'pages/' + page.id + '/' + page.slug;
    }

    public viewName(name: string) {
        return name.replace(/_/g, ' ');
    }
}
