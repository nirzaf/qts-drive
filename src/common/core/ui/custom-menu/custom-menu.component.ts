import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    Input,
    OnDestroy,
    OnInit
} from '@angular/core';
import {Subscription} from 'rxjs';
import {CurrentUser} from '@common/auth/current-user';
import {Menu} from '@common/core/ui/custom-menu/menu';
import {Settings} from '@common/core/config/settings.service';
import {snakeCase} from '@common/core/utils/snake-case';
import {MenuItem, MenuItemCondition} from '@common/core/ui/custom-menu/menu-item';
import {getQueryParams} from '@common/core/utils/get-query-params';
import {AppearanceListenerService} from '@common/shared/appearance/appearance-listener.service';
import {distinctUntilKeyChanged, skip, startWith} from 'rxjs/operators';

@Component({
    selector: 'custom-menu',
    templateUrl: './custom-menu.component.html',
    styleUrls: ['./custom-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomMenuComponent implements OnInit, OnDestroy {
    @HostBinding('class.hidden') shouldHide = false;
    @Input() @HostBinding('class.vertical') vertical = false;
    @Input() @HostBinding('class.horizontal') horizontal = false;
    @Input() @HostBinding('class.compact') compact = false;
    @Input() position: string|MenuItem[];
    @Input() showTitle = false;
    @Input() itemClass: string;
    public menu = new Menu();
    public subscriptions: Subscription[] = [];

    constructor(
        private settings: Settings,
        private currentUser: CurrentUser,
        private changeDetector: ChangeDetectorRef,
        private appearance: AppearanceListenerService,
        private cd: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        // need to init menu here in case
        // custom menu is passed via "position"
        this.initMenu();

        // re-render if menu setting is changed
        if (this.appearance.active) {
            const sub = this.settings.all$()
                // skip first settings change, as menu will
                // already by initiated with initial settings above
                .pipe(skip(1), distinctUntilKeyChanged('menus'))
                .subscribe(() => {
                    this.initMenu();
                    this.cd.markForCheck();
                });
            this.subscriptions.push(sub);
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription && subscription.unsubscribe();
        });
    }

    public toSnakeCase(string: string) {
        return snakeCase(string);
    }

    public shouldShow(condition: MenuItemCondition): boolean {
        if ( ! condition) return true;

        if (Array.isArray(condition)) {
            return condition.every(c => this.shouldShow(c));
        }
        
        if (typeof condition === 'function') {
            return condition(this.currentUser, this.settings);
        }

        switch (condition) {
            case 'auth':
                return this.currentUser.isLoggedIn();
            case 'guest':
                return !this.currentUser.isLoggedIn();
            case 'admin':
                return this.currentUser.hasPermission('admin');
            default:
                let negate = false;
                if (condition.startsWith('!')) {
                    condition = condition.substr(1);
                    negate = true;
                }
                if (condition.startsWith('permission:')) {
                    return negate !== this.currentUser.hasPermission(condition.split(':')[1]);
                } else {
                    return true;
                }
        }
    }

    public getItemType(item: MenuItem): string {
        if (item.type === 'link' && item.action.indexOf('//') === -1) return 'route';
        if (item.action.indexOf(this.settings.getBaseUrl(true)) > -1) return 'route';
        return item.type;
    }

    public parseRoute(action: string) {
        const parts = action.split('?');
        return {link: parts[0], queryParams: getQueryParams(action)};
    }

    private initMenu() {
        // menu items have been specified, instead of position
        if (typeof this.position !== 'string') {
            this.menu = new Menu({items: this.position});
            return;
        }

        // get stored custom menus
        const json = this.settings.get('menus');
        const menus = JSON.parse(json);
        if ( ! menus) return this.shouldHide = true;

        // find first menu for specified position
        const menuConfig = menus.find(menu => menu.position === this.position);
        if ( ! menuConfig) {
            return this.shouldHide = true;
        }

        this.menu = new Menu(menuConfig);
        this.shouldHide = false;
    }
}
