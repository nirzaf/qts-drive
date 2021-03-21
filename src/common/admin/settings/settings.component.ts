import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, Routes} from '@angular/router';
import {SettingsState} from './settings-state.service';
import {Settings} from '../../core/config/settings.service';
import {APP_SETTING_ROUTES} from '../../../app/admin/app-admin-routes';
import {BehaviorSubject} from 'rxjs';
import {BreakpointsService} from '@common/core/ui/breakpoints.service';
import {filter} from 'rxjs/operators';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
    public activePanel$ = new BehaviorSubject<string>(this.route.firstChild.routeConfig.path);
    constructor(
        public settings: Settings,
        private route: ActivatedRoute,
        private router: Router,
        private state: SettingsState,
        public breakpoints: BreakpointsService,
    ) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.state.setAll(data['settings']);
        });

        this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe(() => {
                this.activePanel$.next(this.route.firstChild.routeConfig.path);
            });
    }

    public appRoutes(): Routes {
        return APP_SETTING_ROUTES;
    }
}
