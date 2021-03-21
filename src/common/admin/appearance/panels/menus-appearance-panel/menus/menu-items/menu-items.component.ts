import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {MenuItem} from '@common/core/ui/custom-menu/menu-item';
import {MenuEditor} from '@common/admin/appearance/panels/menus-appearance-panel/menus/menu-editor.service';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {OverlayPanel} from '@common/core/ui/overlay-panel/overlay-panel.service';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';
import {IconSelectorComponent} from '@common/shared/icon-selector/icon-selector.component';
import {RIGHT_POSITION} from '@common/core/ui/overlay-panel/positions/right-position';

@Component({
    selector: 'menu-items',
    templateUrl: './menu-items.component.html',
    styleUrls: ['./menu-items.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuItemsComponent implements OnDestroy {
    public selectedMenuItem: MenuItem;
    public subscriptions: Subscription[] = [];

    constructor(
        public menus: MenuEditor,
        private modal: Modal,
        private overlayPanel: OverlayPanel,
        private cd: ChangeDetectorRef,
    ) {}

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription && subscription.unsubscribe();
        });
    }

    public reorderMenuItems(e: CdkDragDrop<void>) {
        this.menus.reorderActiveMenuItems(e.previousIndex, e.currentIndex);
    }

    /**
     * Toggle specified menu item settings panel visibility.
     */
    public toggleMenuItem(item: MenuItem) {
        if (this.selectedMenuItem === item) {
            this.selectedMenuItem = null;
        } else {
            this.selectedMenuItem = item;
        }
    }

    /**
     * Ask user to confirm menu item deletion.
     */
    public confirmMenuItemDeletion() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Menu Item',
            body: 'Are you sure you want to delete this menu item?',
            ok: 'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.menus.removeItem(this.selectedMenuItem);
            this.selectedMenuItem = null;
        });
    }

    public openIconSelector(origin: HTMLElement, menuItem: MenuItem) {
        this.overlayPanel.open(IconSelectorComponent, {
            position: RIGHT_POSITION,
            origin: new ElementRef(origin),
        }).valueChanged().subscribe(icon => {
            menuItem.icon = icon;
            this.menus.commitChanges();
            this.cd.detectChanges();
        });
    }
}
