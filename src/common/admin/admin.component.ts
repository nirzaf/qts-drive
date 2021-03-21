import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Settings} from '../core/config/settings.service';
import {CurrentUser} from '../auth/current-user';
import {BreakpointsService} from '../core/ui/breakpoints.service';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {MenuItem} from '@common/core/ui/custom-menu/menu-item';

@Component({
    selector: 'admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent implements OnInit {
    public leftColumnIsHidden = false;
    public menu = this.generateMenu();

    constructor(
        public settings: Settings,
        public currentUser: CurrentUser,
        public breakpoints: BreakpointsService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.leftColumnIsHidden = this.breakpoints.isMobile$.value;
        this.menu = this.generateMenu();

        // close left column when navigating between admin pages on mobile
        this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe(() => {
                this.leftColumnIsHidden = this.breakpoints.isMobile$.value;
            });
    }

    public toggleLeftSidebar() {
        this.leftColumnIsHidden = !this.leftColumnIsHidden;
    }

    public getCustomSidebarItems() {
        return this.settings.get('vebto.admin.pages');
    }

    // TODO: refactor this later, so can be changed from menu manager
    private generateMenu() {
        const items = [
            {name: 'analytics', icon: 'pie-chart', permission: 'reports.view', route: 'analytics'},
            {name: 'appearance', icon: 'style', permission: 'resources.defaults.permissions.update', route: 'appearance'},
            {name: 'settings', icon: 'settings', permission: 'settings.view', route: 'settings'},

            {name: 'plans', icon: 'assignment', permission: 'plans.view', route: 'plans'},
            {name: 'subscriptions', icon: 'subscriptions', permission: 'subscriptions.view', route: 'subscriptions'},

            ...this.getCustomSidebarItems(),

            {name: 'users', icon: 'person', permission: 'users.view', route: 'users'},
            {name: 'roles', icon: 'people', permission: 'roles.view', route: 'roles'},
            {name: 'pages', icon: 'page', permission: 'pages.view', route: 'custom-pages'},
            {name: 'tags', icon: 'local-offer', permission: 'tags.view', route: 'tags'},
            {name: 'files', icon: 'file', permission: 'files.view', route: 'files'},
            {name: 'translations', icon: 'translate', permission: 'localizations.view', route: 'translations'},
        ];

        if (this.settings.get('vebto.admin.ads')) {
            items.push({name: 'ads', icon: 'ads', permission: 'settings.view', route: 'ads'});
        }
        
        return items.map(item => {
            item.type = 'route';
            item.label = item.name;
            item.action = 'admin/' + item.route;
            item.activeExact = false;
            item.condition = function(user: CurrentUser, settings: Settings) {
                let condition = true;
                if (item.name === 'plans' || item.name === 'subscriptions') {
                    condition = settings.get('billing.enable');
                }
                return condition && user.hasPermission(item.permission);
            };
            return item;
        }) as MenuItem[];
    }
}
