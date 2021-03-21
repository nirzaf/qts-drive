import { AppConfig } from '@common/core/config/app-config';

export const BEDRIVE_CONFIG: AppConfig = {
    assetsPrefix: 'client',
    navbar: {
        defaultColor: 'accent',
        defaultPosition: 'drive-navbar',
        dropdownItems: [
            {route: '/drive', name: 'My Files', icon: 'network-drive-custom'},
        ]
    },
    auth: {
        redirectUri: '/drive',
        adminRedirectUri: '/drive',
        color: 'primary',
    },
    demo: {
        email: null,
    },
    admin: {
        ads: [
            {
                slot: 'ads.file-preview',
                description: 'This ad will appear on shared file preview page.',
            },
            {
                slot: 'ads.drive',
                description: 'This ad will appear on user drive page.',
            },
            {
                slot: 'ads.landing.top',
                description: 'This ad will appear at the top of the landing page.',
            },
        ],
    },
    translations: {
        uploads_disk_driver_description: 'Where drive file uploads should be stored.',
    }
};
