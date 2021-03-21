import {ChangeDetectionStrategy, Component, ElementRef} from '@angular/core';
import {AppearanceEditor} from '@common/admin/appearance/appearance-editor/appearance-editor.service';
import {MenuEditor} from '@common/admin/appearance/panels/menus-appearance-panel/menus/menu-editor.service';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {Settings} from '@common/core/config/settings.service';
import {OverlayPanel} from '@common/core/ui/overlay-panel/overlay-panel.service';
import {RIGHT_POSITION} from '@common/core/ui/overlay-panel/positions/right-position';
import {AddMenuItemPanelComponent} from '@common/admin/appearance/panels/menus-appearance-panel/menus/add-menu-item-panel/add-menu-item-panel.component';
import {Menu} from '@common/core/ui/custom-menu/menu';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';

@Component({
    selector: 'menus-appearance-panel',
    templateUrl: './menus-appearance-panel.component.html',
    styleUrls: ['./menus-appearance-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenusAppearancePanelComponent {
    constructor(
        public appearance: AppearanceEditor,
        public menus: MenuEditor,
        private modal: Modal,
        private settings: Settings,
        private panel: OverlayPanel,
        private el: ElementRef<HTMLElement>,
    ) {
        this.menus.setFromJson(this.settings.get('menus'));
    }

    public openAddItemPanel() {
        const position = RIGHT_POSITION.slice();
        position[0].offsetX = 10;
        position[1].offsetX = 10;
        this.panel.open(AddMenuItemPanelComponent, {
            position: position,
            origin: this.el,
            panelClass: 'add-menu-item-panel-container'
        });
    }

    public openPreviousPanel() {
        if (this.menus.activeMenu$.value) {
            this.menus.activeMenu$.next(null);
        } else {
            this.appearance.closeActivePanel();
        }
    }

    public setActiveMenu(menu: Menu) {
        this.menus.activeMenu$.next(menu);
    }

    public confirmMenuDeletion() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Menu',
            body: 'Are you sure you want to delete this menu?',
            ok: 'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.menus.deleteActive();
        });
    }

    public getDisplayName(name: string) {
        return name.replace(/-/g, ' ');
    }
}
