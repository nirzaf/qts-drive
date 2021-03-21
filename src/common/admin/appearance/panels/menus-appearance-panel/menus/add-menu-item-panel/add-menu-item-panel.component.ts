import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {OverlayPanelRef} from '@common/core/ui/overlay-panel/overlay-panel-ref';
import {MenuEditor} from '@common/admin/appearance/panels/menus-appearance-panel/menus/menu-editor.service';
import {AppearanceEditor} from '@common/admin/appearance/appearance-editor/appearance-editor.service';
import {MenuItem} from '@common/core/ui/custom-menu/menu-item';
import {FormBuilder} from '@angular/forms';
import {MenuItemCategory} from '@common/admin/appearance/panels/menus-appearance-panel/menus/item-categories/menu-item-category';
import {MenuItemCategoriesService} from '@common/admin/appearance/panels/menus-appearance-panel/menus/item-categories/menu-item-categories.service';

@Component({
    selector: 'add-menu-item-panel',
    templateUrl: './add-menu-item-panel.component.html',
    styleUrls: ['./add-menu-item-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddMenuItemPanelComponent implements OnInit {
    public linkForm = this.fb.group({
        action: [''],
        label: [''],
    });
    public menuItemCategories: MenuItemCategory[];

    constructor(
        public editor: MenuEditor,
        public appearance: AppearanceEditor,
        private overlayPanelRef: OverlayPanelRef,
        private fb: FormBuilder,
        private itemCategories: MenuItemCategoriesService,
    ) {}

    ngOnInit() {
        this.itemCategories.get().subscribe(response => {
            this.menuItemCategories = response.categories;
        });
    }

    public addLinkMenuItem() {
        this.editor.addItem(new MenuItem({
            type: 'link',
            label: this.linkForm.value.label,
            action: this.linkForm.value.action,
        }));

        this.linkForm.reset();
        this.close();
    }

    public addRouteMenuItem(route: string) {
        this.editor.addItem(new MenuItem({
            type: 'route',
            label: route,
            action: route,
        }));
        this.close();
    }

    public addCustomMenuItem(item: Partial<MenuItem>) {
        this.editor.addItem(new MenuItem(item));
        this.close();
    }

    public close() {
        this.overlayPanelRef.close();
    }
}
