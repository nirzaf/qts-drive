import {InjectionToken} from '@angular/core';
import {ComponentType} from '@angular/cdk/portal';
import {Params} from '@angular/router';

export interface AppearanceEditorConfig {
    navigationRoutes: string[];
    defaultRoute?: string;
    sections?: AppearanceEditorField[];
    menus: {
        availableRoutes: string[],
        positions?: string[],
    };
}

export interface AppearanceEditorField {
    name: string;
    component?: ComponentType<any>;
    position?: number;
    route?: string;
    queryParams?: Params;
}

export const APPEARANCE_EDITOR_CONFIG = new InjectionToken<AppearanceEditorConfig[]>('APPEARANCE_EDITOR_CONFIG');

export const DEFAULT_APPEARANCE_EDITOR_CONFIG: AppearanceEditorConfig = {
    navigationRoutes: [],
    menus: {
        availableRoutes: [
            'login',
            'register',
            'contact',
            'billing/pricing',
            'account-settings',
            'admin/appearance',
            'admin/users',
            'admin/settings/authentication',
            'admin/settings/branding',
            'admin/settings/cache',
            'admin/settings/providers',
            'admin/roles',
        ],
        positions: [
            'admin-navbar',
            'custom-page-navbar',
            'auth-page-footer',
        ]
    },
    sections: [
        {name: 'general', position: 1},
        {name: 'themes', position: 2},
        {name: 'menus', position: 3},
        {name: 'custom-code', position: 4},
        {name: 'seo-settings', position: 5}
    ]
};
