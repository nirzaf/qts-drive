import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {SettingsPanelComponent} from '../settings-panel.component';
import {CssTheme} from '@common/core/types/models/CssTheme';
import {MenuItemCategory} from '@common/admin/appearance/panels/menus-appearance-panel/menus/item-categories/menu-item-category';
import {BehaviorSubject} from 'rxjs';
import {CustomHomepagePage} from '@common/pages/shared/custom-homepage.service';
import {finalize} from 'rxjs/operators';

@Component({
    selector: 'homepage-settings',
    templateUrl: './general-settings.component.html',
    styleUrls: ['./general-settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'settings-panel'},
})
export class GeneralSettingsComponent extends SettingsPanelComponent implements OnInit {
    public menuItemCategories$ = new BehaviorSubject<MenuItemCategory[]>([]);
    public cssThemes: CssTheme[] = [];

    ngOnInit() {
        this.valueLists.get(['menuItemCategories', 'themes']).subscribe(response => {
            this.menuItemCategories$.next(response.menuItemCategories);
            this.cssThemes = response.themes;
        });
    }

    public getHomepageComponents() {
        return this.customHomepage.getComponents();
    }

    public getDisplayName(page: CustomHomepagePage) {
        return (page.routeConfig?.data && page.routeConfig.data.name) ||
            page.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    public urlsDontMatch() {
        return this.state.server['newAppUrl'] && this.state.server['newAppUrl'] !== this.state.server['app_url'];
    }

    public createSitemap() {
        this.loading$.next(true);
        return this.http.post('sitemap/generate')
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(() => {
                this.toast.open('Sitemap generated.');
            });
    }
}
