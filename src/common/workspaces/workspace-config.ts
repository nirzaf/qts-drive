import { InjectionToken } from '@angular/core';

export interface WorkspaceConfig {
    description: string;
}

export const WORKSPACE_CONFIG = new InjectionToken<WorkspaceConfig>('WORKSPACE_CONFIG');
