import {ChangeDetectionStrategy, Component, Input, Output, EventEmitter} from '@angular/core';
import {CurrentUser} from '@common/auth/current-user';
import {AuthService} from '@common/auth/auth.service';
import {Settings} from '@common/core/config/settings.service';
import {BreakpointsService} from '@common/core/ui/breakpoints.service';
import {ThemeService} from '@common/core/theme.service';
import {NavbarDropdownItem} from '@common/core/config/app-config';

@Component({
    selector: 'logged-in-user-menu',
    templateUrl: './logged-in-user-menu.component.html',
    styleUrls: ['./logged-in-user-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoggedInUserMenuComponent {
    @Input() hideRegisterButton = false;
    @Input() hideConfigItems = false;
    @Input() forceNotifButton = false;
    @Output() itemClicked = new EventEmitter();

    constructor(
        public currentUser: CurrentUser,
        public auth: AuthService,
        public config: Settings,
        public breakpoints: BreakpointsService,
        public theme: ThemeService,
    ) {}


    public shouldShowMenuItem(item: NavbarDropdownItem): boolean {
        const hasPermission = !item.permission || this.currentUser.hasPermission(item.permission),
            hasRole = !item.role || this.currentUser.hasRole(item.role);
        return hasPermission && hasRole;
    }

    public onItemClick() {
        this.itemClicked.emit();
    }
}
