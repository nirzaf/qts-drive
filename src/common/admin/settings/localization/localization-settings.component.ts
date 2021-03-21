import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SettingsPanelComponent } from '../settings-panel.component';
import { SelectOptionLists } from '@common/core/services/value-lists.service';

@Component({
    selector: 'localization-settings',
    templateUrl: './localization-settings.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'settings-panel'},
})
export class LocalizationSettingsComponent extends SettingsPanelComponent implements OnInit {
    public selects: SelectOptionLists = {
        timezones: {},
        localizations: []
    };
    public defaultDateFormats = ['MMMM d, y', 'y-M-d', 'M/d/y', 'd/M/y'];
    public initialDateFormat: string;

    ngOnInit() {
        const initial = this.state.client['dates.format'] as string;
        this.initialDateFormat = this.defaultDateFormats.includes(initial) ? initial : 'custom';
        this.valueLists.get(['timezones', 'localizations']).subscribe(response => {
            this.selects = response;
            this.cd.markForCheck();
        });
    }

    public getCurrentDate() {
        return new Date();
    }

    public updateDateFormat(value: string) {
        if (value && value !== 'custom') {
            this.state.client['dates.format'] = value;
        }
    }

    public selectedDateFormat() {
        return this.state.client['dates.format'] as string;
    }
}
