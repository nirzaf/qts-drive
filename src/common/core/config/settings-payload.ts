export interface SettingsPayload {
    server?: {[key: string]: number|string};
    client?: {[key: string]: number|string};
    files?: {[key: string]: File};
}

export interface SettingsJsonPayload {
    server?: string;
    client?: string;
    files?: {[key: string]: File};
}
