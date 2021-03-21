import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CurrentUser} from '@common/auth/current-user';
import {Settings} from '@common/core/config/settings.service';
import {BreakpointsService} from '@common/core/ui/breakpoints.service';

@Component({
    selector: 'logged-in-user-widget',
    templateUrl: './logged-in-user-widget.component.html',
    styleUrls: ['./logged-in-user-widget.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoggedInUserWidgetComponent  {
    @Input() hideRegisterButton = false;

    constructor(
        public currentUser: CurrentUser,
        public config: Settings,
        public breakpoints: BreakpointsService,
    ) {}
}
