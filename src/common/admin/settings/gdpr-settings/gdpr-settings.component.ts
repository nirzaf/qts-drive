import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {SettingsPanelComponent} from '@common/admin/settings/settings-panel.component';
import {BehaviorSubject} from 'rxjs';
import {MenuItemCategory} from '@common/admin/appearance/panels/menus-appearance-panel/menus/item-categories/menu-item-category';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {MenuItem} from '@common/core/ui/custom-menu/menu-item';

@Component({
    selector: 'gdpr-settings',
    templateUrl: './gdpr-settings.component.html',
    styleUrls: ['./gdpr-settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'settings-panel'},
})
export class GdprSettingsComponent extends SettingsPanelComponent implements OnInit {
    public customPages$ = new BehaviorSubject<MenuItemCategory>({name: '', items: []});
    public registerPolicies = new FormArray([]);

    ngOnInit() {
        this.valueLists.get(['menuItemCategories']).subscribe(response => {
            this.customPages$.next(response.menuItemCategories.find(c => c.name === 'Custom Page'));
        });

        this.settings.getJson('register_policies', []).forEach(policy => {
            this.addRegisterPolicy(policy);
        });
    }

    public saveSettings() {
        const settings = this.state.getModified();
        settings.client.register_policies = JSON.stringify(this.registerPolicies.value);
        super.saveSettings(settings);
    }

    public addRegisterPolicy(policy: Partial<MenuItem> = {}) {
        this.registerPolicies.push(new FormGroup({
            label: new FormControl(policy.label || ''),
            action: new FormControl(policy.action || this.getFirstCustomPageAction()),
            type: new FormControl(policy.type || 'page'),
        }));
    }

    public removeRegisterPolicy(i: number) {
        this.registerPolicies.removeAt(i);
    }

    public onPolicyTypeChange(control: AbstractControl) {
        control.get('action').reset();
        if (control.get('type').value === 'page') {
            control.get('action').setValue(this.getFirstCustomPageAction());
        }
    }

    private getFirstCustomPageAction(): string {
        return this.customPages$.value.items[0] && this.customPages$.value.items[0].action;
    }
}
