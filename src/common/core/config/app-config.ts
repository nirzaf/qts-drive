import {environment} from '../../../environments/environment';
import {InjectionToken} from '@angular/core';

export const APP_CONFIG = new InjectionToken<AppConfig[]>('APP_CONFIG');

export const DEFAULT_APP_CONFIG: AppConfig = {
    environment: environment.production ? 'production' : 'dev',
    assetsPrefix: null,
    auth: {
        // Route users should be redirected to after successful login.
        redirectUri: '/',
        // Route admins should be redirected to after successful login.
        adminRedirectUri: '/',
    },
    accountSettings: {
        hideNavbar: false,
    },
    demo: {
        email: 'admin@admin.com',
        password: 'admin',
    },
    customPages: {
        hideNavbar: false,
    },
    translations: {
        public_disk_driver_description:  'Where public uploads (like user avatars) should be stored.',
    }
};

export interface AdSlotConfig {
    name?: string;
    slot: string;
    description: string;
}

export interface AppConfig {
    [key: string]: any;

    // backend stuff
    base_url?: string;
    version?: string;
    'homepage.type'?: string;
    'homepage.value'?: string;
    'logging.sentry_public'?: string;
    'dates.format'?: string;
    'ads.disable'?: boolean;
    menus?: string;
    'i18n.enable'?: boolean;
    'branding.site_name'?: string;

    // common config
    environment?: 'production'|'dev';
    assetsPrefix?: string|null;
    auth?: {
        redirectUri?: string,
        adminRedirectUri?: string,
        color?: 'accent'|'primary',
    };
    accountSettings?: {
        hideNavbar?: boolean,
    };
    navbar?: {
        defaultPosition: string,
        defaultColor: 'accent'|'primary',
        dropdownItems: NavbarDropdownItem[],
    };
    demo?: {
        email?: string,
        password?: string,
    };
    admin?: {
        showIncomingMailMethod?: boolean;
        analytics?: {
            channels?: AnalyticsChannel[],
        },
        ads?: AdSlotConfig[],
        pages?: {name: string, icon: string, route: string, permission: string}[],
        tagTypes?: {name: string, system?: boolean}[],
        settingsPages?: {name: string, route: string}[],
    };
}

export interface AnalyticsChannel {
    name: string;
    route: string;
    condition?: string;
    hideHeaderData?: boolean;
}

export interface NavbarDropdownItem {route: string;
    name: string;
    icon: string;
    permission?: string;
    role?: string;
}
