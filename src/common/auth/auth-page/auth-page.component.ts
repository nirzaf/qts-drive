import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Settings} from '@common/core/config/settings.service';
import {ThemeService} from '@common/core/theme.service';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '@common/auth/auth.service';

@Component({
    selector: 'auth-page',
    templateUrl: './auth-page.component.html',
    styleUrls: ['./auth-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPageComponent implements OnInit {
    @Input() infoRowTarget: 'signin'|'signup' = 'signup';

    constructor(
        public settings: Settings,
        private theme: ThemeService,
        private route: ActivatedRoute,
        private auth: AuthService,
    ) {}

    ngOnInit() {
        if (this.route.snapshot.queryParams.email) {
            this.auth.forcedEmail$.next(this.route.snapshot.queryParams.email);
        }
    }

    public logoUrl() {
        return this.settings.get(`branding.logo_${this.theme.isDarkMode() ? 'light' : 'dark'}`);
    }
}
