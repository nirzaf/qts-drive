import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject} from '@angular/core';
import {SettingsPanelComponent} from '../settings-panel.component';
import {Settings} from '@common/core/config/settings.service';
import {Toast} from '@common/core/ui/toast.service';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {ActivatedRoute} from '@angular/router';
import {CustomHomepage} from '@common/pages/shared/custom-homepage.service';
import {ValueLists} from '@common/core/services/value-lists.service';
import {SettingsState} from '@common/admin/settings/settings-state.service';
import {RECAPTCHA_ACTIONS} from '@common/admin/settings/recaptcha/recaptcha-actions.token';
import {RecaptchaAction} from '@common/admin/settings/recaptcha/recaptcha-action';
import {flattenArray} from '@common/core/utils/flatten-array';

@Component({
    selector: 'recaptcha-settings',
    templateUrl: './recaptcha-settings.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'settings-panel'},
})
export class RecaptchaSettingsComponent extends SettingsPanelComponent {
    public readonly actions: RecaptchaAction[];
    constructor(
        public settings: Settings,
        protected toast: Toast,
        protected http: AppHttpClient,
        protected modal: Modal,
        protected route: ActivatedRoute,
        protected customHomepage: CustomHomepage,
        protected valueLists: ValueLists,
        protected cd: ChangeDetectorRef,
        public state: SettingsState,
        @Inject(RECAPTCHA_ACTIONS) private recaptchaActions: RecaptchaAction[][],
    ) {
        super(settings, toast, http, modal, route, customHomepage, valueLists, cd, state);
        this.actions = flattenArray(this.recaptchaActions).reverse();
    }
}
