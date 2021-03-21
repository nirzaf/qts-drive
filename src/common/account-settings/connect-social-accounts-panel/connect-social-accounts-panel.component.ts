import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {Toast} from '../../core/ui/toast.service';
import {Settings} from '../../core/config/settings.service';
import {SocialAuthService} from '../../auth/social-auth.service';
import {User} from '../../core/types/models/User';

@Component({
    selector: 'connect-social-accounts-panel',
    templateUrl: './connect-social-accounts-panel.component.html',
    styleUrls: ['./connect-social-accounts-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectSocialAccountsPanelComponent {
    @Input() user: User;

    constructor(
        private social: SocialAuthService,
        private toast: Toast,
        public settings: Settings,
        private cd: ChangeDetectorRef,
    ) {}

    public connectSocialAccount(name: string) {
        this.social.connect(name).then(user => {
            this.user.social_profiles = user.social_profiles;
            this.toast.open('Connected: ' + name);
            this.cd.markForCheck();
        });
    }

    public disconnectSocialAccount(name: string) {
        this.social.disconnect(name).subscribe(() => {
            this.toast.open('Disconnected: ' + name);
            const i = this.user.social_profiles.findIndex(s => s.service_name === name);
            this.user.social_profiles.splice(i, 1);
            this.cd.markForCheck();
        });
    }

    public getSocialAccountUsername(name: string): string {
        if ( ! this.user.social_profiles) return;

        const account = this.user.social_profiles
            .find(social => social.service_name === name);

        return account && account.username;
    }
}
