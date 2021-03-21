import { Routes } from '@angular/router';
import { DriveSettingsComponent } from './settings/drive-settings/drive-settings.component';

export const APP_ADMIN_ROUTES: Routes = [
  //
];

export const APP_SETTING_ROUTES: Routes = [
    {path: 'drive', component: DriveSettingsComponent},
];
