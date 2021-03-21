import {HomepageAppearancePanelComponent} from './homepage-appearance-panel/homepage-appearance-panel.component';
import {AppearanceEditorConfig} from '../../../common/admin/appearance/appearance-editor-config.token';

export const APP_APPEARANCE_CONFIG: AppearanceEditorConfig = {
    defaultRoute: 'drive',
    navigationRoutes: [
        's',
        'drive',
    ],
    menus: {
        positions: [
            'drive-navbar',
            'drive-sidebar',
            'homepage-navbar',
            'admin-navbar',
            'custom-page-navbar',
        ],
        availableRoutes: [
            'drive/shares',
            'drive/recent',
            'drive/starred',
            'drive/trash',
            'drive/workspaces',
        ]
    },
    sections: [
        {
            name: 'landing page',
            component: HomepageAppearancePanelComponent,
            position: 1,
            route: '/',
        }
    ]
};
