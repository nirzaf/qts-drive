import {ComponentFactoryResolver, ElementRef, Injectable, Injector, NgZone} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {ComponentPortal, ComponentType, PortalInjector} from '@angular/cdk/portal';
import {Overlay, PositionStrategy} from '@angular/cdk/overlay';
import {filter} from 'rxjs/operators';
import {ContextMenuRef} from './context-menu-ref';
import {CONTEXT_MENU_DATA} from './context-menu-data';

export interface ContextMenuParams {
    data?: { [key: string]: any };
    offsetX?: number;
    offsetY?: number;
    originX?: 'start' | 'center' | 'end';
    originY?: 'top' | 'center' | 'bottom';
    overlayX?: 'start' | 'center' | 'end';
    overlayY?: 'top' | 'center' | 'bottom';
}

type MenuOrigin = MouseEvent | EventTarget | HTMLElement;

const ORIGIN_ID = 'dynamic-context-menu-origin';

@Injectable({
    providedIn: 'root'
})
export class ContextMenu {
    private lastOrigin: HTMLElement;
    private openContextMenu: ContextMenuRef<any>|null;

    constructor(
        private router: Router,
        private zone: NgZone,
        private injector: Injector,
        private resolver: ComponentFactoryResolver,
        private overlay: Overlay,
    ) {
        this.router.events
            .pipe(filter(e => e instanceof NavigationStart))
            .subscribe(() => this.close());
    }

    public open<T>(component: ComponentType<T>, e: MenuOrigin, params: ContextMenuParams = {}): ContextMenuRef<T> {
        this.close();

        if ( ! component) {
            return;
        }

        const overlayRef = this.createOverlay(e, params);
        this.openContextMenu = new ContextMenuRef(overlayRef);

        const injector = new PortalInjector(this.injector, new WeakMap<any, any>([
            [CONTEXT_MENU_DATA, params.data],
            [ContextMenuRef, this.openContextMenu],
        ]));

        const portal = new ComponentPortal(component, null, injector);

        overlayRef.attach(portal);
        this.bindEventsToOverlay();

        return this.openContextMenu;
    }

    /**
     * Close currently open context menu.
     */
    public close() {
        this.removeLastOrigin();

        if (this.openContextMenu) {
            this.openContextMenu.close();
            this.openContextMenu = null;
        }
    }

    private createOverlay(e: MenuOrigin, params: ContextMenuParams) {
        return this.overlay.create({
            positionStrategy: this.getMenuPositionStrategy(e, params),
            scrollStrategy: this.overlay.scrollStrategies.close(),
            hasBackdrop: true,
            backdropClass: 'context-menu-backdrop',
            panelClass: 'context-menu-overlay'
        });
    }

    private bindEventsToOverlay() {
        this.openContextMenu.contextMenuElement().addEventListener('click', () => {
            this.close();
        });

        this.openContextMenu.backdropClick().subscribe(() => {
            this.close();
        });

        this.openContextMenu.backdropElement().addEventListener('contextmenu', e => {
            e.preventDefault();
            this.close();
        });

        this.openContextMenu.detachments().subscribe(() => {
            this.close();
        });
    }

    private getMenuPositionStrategy(e: MenuOrigin, params: ContextMenuParams): PositionStrategy {
        this.createOriginFromEvent(e, params);

        const primary = {
            originX: params.originX || 'center',
            originY: params.originY || 'bottom',
            overlayX: params.overlayX || 'center',
            overlayY: params.overlayY || 'top',
        };

        return this.overlay.position().flexibleConnectedTo(new ElementRef(this.lastOrigin))
            .withPositions([
                primary,
                {originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom'},
                {originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top'},
                {originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'bottom'}
            ]);
    }

    private createOriginFromEvent(e: MenuOrigin, params: ContextMenuParams) {
        this.removeLastOrigin();

        if (e instanceof HTMLElement || e instanceof EventTarget) {
            this.lastOrigin = e as HTMLElement;
        } else {
            this.lastOrigin = document.createElement('div');
            this.lastOrigin.style.position = 'fixed';
            this.lastOrigin.style.top = e.clientY + (params.offsetY || 0) + 'px';
            this.lastOrigin.style.left = e.clientX + (params.offsetX || 0) + 'px';
            this.lastOrigin.id = ORIGIN_ID;
            document.body.appendChild(this.lastOrigin);
        }
    }

    private removeLastOrigin() {
        if (this.lastOrigin && this.lastOrigin.id === ORIGIN_ID) {
            this.lastOrigin.remove();
        }
    }
}
