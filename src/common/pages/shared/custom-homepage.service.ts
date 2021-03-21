import {Injectable} from '@angular/core';
import {Route, Router} from '@angular/router';
import {Settings} from '../../core/config/settings.service';
import {CustomPageComponent} from './custom-page/custom-page.component';
import {CurrentUser} from '../../auth/current-user';
import {APPEARANCE_TOKEN} from '../../shared/appearance/appearance-listener.service';

interface MenuCategory {
    name: string;
    route: Route;
}

export interface CustomHomepagePage {
    routeConfig?: Route;
    name: string;
    // homepage change will be handled by the app itself, it's only
    // specified here so user can select it from settings page
    ignore?: boolean;
    guestOnly?: boolean;
    makeRoot?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class CustomHomepage {
    private originalRoute: Route;
    private defaultComponents: CustomHomepagePage[] = [
        {name: 'Login Page', guestOnly: true, routeConfig: {redirectTo: '/login', pathMatch: 'full'}},
        {name: 'Register Page', guestOnly: true, routeConfig: {redirectTo: '/register', pathMatch: 'full'}},
    ];

    private menuCategories: MenuCategory[] = [
        {name: 'Custom Page', route: {component: CustomPageComponent}},
    ];

    constructor(
        private router: Router,
        private settings: Settings,
        private currentUser: CurrentUser,
    ) {}

    public select(custom: {menuCategories?: MenuCategory[], routes?: CustomHomepagePage[]} = {}) {
        this.defaultComponents = this.defaultComponents.concat(custom.routes || []);
        this.menuCategories = this.menuCategories.concat(custom.menuCategories || []);

        const type = this.settings.get('homepage.type') || 'default',
            value = this.settings.get('homepage.value');

        if (type === 'default' || type == null) {
            return;
        } else if (type === 'component') {
            return this.setComponentAsHomepage(value);
        } else {
            const category = this.menuCategories.find(c => c.name === type);
            if (category) {
                const route = {...category.route, data: {id: value}};
                this.addRoute(route);
            }
        }
    }

    public getComponents() {
        return this.defaultComponents;
    }

    private setComponentAsHomepage(name: string) {
        const page = this.defaultComponents.find(comp => comp.name === name);
        if ( ! page || page.ignore) return;
        let routeConfig = {...page.routeConfig};
        if (page.guestOnly && (this.currentUser.isLoggedIn() && ! this.isPreviewMode())) {
            // if homepage is guest only and we have set it already, reset it to original
            // otherwise after login user would be redirected to this guest only page
            if (this.originalRoute) {
                routeConfig = this.originalRoute;

            // otherwise bail to avoid infinite redirect if user is logged in and "login" page is set as homepage
            } else {
                return;
            }
        }
        this.addRoute(routeConfig, page.makeRoot);
    }

    private addRoute(route: Route, makeRoot = false) {
        const parent = makeRoot ? null : this.getParentHomeRoute();
        route = this.prepareRoute(route);

        // use child routes if parent exists, otherwise use base router config
        const routes = parent ? parent.children : this.router.config;

        // remove already existing home route
        const i = routes.findIndex(r => r.path === '');

        // add new route specified by user
        if (i > -1) {
            this.originalRoute = this.originalRoute || routes[i];
            routes[i] = route;
        } else {
            routes.unshift(route);
        }
    }

    private getParentHomeRoute(): Route {
        return this.router.config.find(route => {
            return route.data && route.data.parentHomeRoute;
        });
    }

    private prepareRoute(route: Route) {
        route.path = '';
        if ( ! route.data) {
            route.data = {};
        }
        if ( ! route.data.name) {
            route.data.name = 'home';
        }
        return route;
    }

    private isPreviewMode() {
        return window.location.search.includes(`be-preview-mode=${APPEARANCE_TOKEN}`);
    }
}
