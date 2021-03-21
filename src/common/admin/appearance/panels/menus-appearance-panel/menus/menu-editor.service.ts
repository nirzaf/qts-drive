import {Injectable} from '@angular/core';
import {moveItemInArray} from '@angular/cdk/drag-drop';
import {Menu} from '@common/core/ui/custom-menu/menu';
import {Settings} from '@common/core/config/settings.service';
import {AppearanceEditor} from '@common/admin/appearance/appearance-editor/appearance-editor.service';
import {MenuItem} from '@common/core/ui/custom-menu/menu-item';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MenuEditor {
    public allMenus$ = new BehaviorSubject< Menu[]>([]);
    public activeMenu$ = new BehaviorSubject<Menu>(null);

    constructor(
        private settings: Settings,
        private appearance: AppearanceEditor,
    ) {}

    public create() {
        const allMenus = [...this.allMenus$.value];
        this.activeMenu$.next(new Menu({name: 'New Menu'}));
        allMenus.push(this.activeMenu$.value);
        this.allMenus$.next(allMenus);
        this.commitChanges();
    }

    public reorderActiveMenuItems(previousIndex: number, currentIndex: number) {
        const activeMenu = {...this.activeMenu$.value};
        moveItemInArray(activeMenu.items, previousIndex, currentIndex);
        this.activeMenu$.next(activeMenu);
        this.commitChanges();
    }

    public deleteActive() {
        const allMenus = [...this.allMenus$.value];
        const i = allMenus.indexOf(this.activeMenu$.value);
        allMenus.splice(i, 1);
        this.activeMenu$.next(null);
        this.allMenus$.next(allMenus);
        this.commitChanges();
    }

    public addItem(item: MenuItem) {
        const activeMenu = {...this.activeMenu$.value};
        item = this.transformLocalLinksToRoutes(item);
        activeMenu.items.push(item);
        this.activeMenu$.next(activeMenu);
        this.commitChanges();
    }

    public removeItem(item: MenuItem) {
        const activeMenu = {...this.activeMenu$.value};
        const i = this.activeMenu$.value.items.indexOf(item);
        activeMenu.items.splice(i, 1);
        this.activeMenu$.next(activeMenu);
        this.commitChanges();
    }

    private transformLocalLinksToRoutes(item: MenuItem): MenuItem {
        const baseUrl = this.settings.getBaseUrl();

        if (item.type !== 'link' || item.action.indexOf(baseUrl) === -1) return item;

        item.type = 'route';
        item.action = item.action.replace(this.settings.getBaseUrl(), '');
        return item;
    }

    public commitChanges() {
        const menus = JSON.stringify(this.allMenus$.value);
        this.appearance.setConfig('menus', menus);
        this.appearance.addChanges({'menus': menus});
    }

    public setFromJson(json: string) {
        if ( ! json) return;
        const menus = JSON.parse(json);

        if ( ! menus) return;

        const allMenus = menus.map(menuData => {
            const menu = new Menu(menuData);
            menu.items = menu.items.map(item => new MenuItem(item));
            return menu;
        });
        this.allMenus$.next(allMenus);
    }
}
