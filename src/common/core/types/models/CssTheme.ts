export class CssTheme {
    id?: number;
    name: string;
    is_dark?: boolean;
    dark_default?: boolean;
    light_default?: boolean;
    colors: CssThemeColors;
    created_at?: string;
    updated_at?: string;

    constructor(params: Object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}

export interface CssThemeColors {
    [key: string]: string;
}

