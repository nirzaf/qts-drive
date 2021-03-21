import { InjectionToken } from '@angular/core';
import {ComponentType} from '@angular/cdk/portal';

export const ACCOUNT_SETTINGS_PANELS = new InjectionToken<ComponentType<any>>('ACCOUNT_SETTINGS_PANELS');
