import {Injectable} from '@angular/core';
import {HttpCacheClient} from '../http/http-cache-client';
import {BackendResponse} from '../types/backend-response';
import {CustomDomain} from '@common/custom-domain/custom-domain';
import {CustomPage} from '@common/core/types/models/CustomPage';
import {Permission} from '@common/core/types/models/permission';
import {CssTheme} from '@common/core/types/models/CssTheme';
import {MenuItemCategory} from '@common/admin/appearance/panels/menus-appearance-panel/menus/item-categories/menu-item-category';
import {Localization} from '@common/core/types/models/Localization';

export interface Currency {
    name: string;
    decimal_digits: number;
    symbol: string;
    code: string;
}

export interface Timezone {
    text: string;
    value: string;
}

export interface SelectOptionLists {
    countries?: CountryListItem[];
    timezones?: {[key: string]: Timezone[]};
    languages?: LanguageListItem[];
    localizations?: Localization[];
    currencies?: {[key: string]: Currency};
    domains?: CustomDomain[];
    pages?: CustomPage[];
    themes?: CssTheme[];
    permissions?: Permission[];
    menuItemCategories?: MenuItemCategory[];
    [key: string]: any;
}

export interface CountryListItem {
    name: string;
    code: string;
}

export interface LanguageListItem {
    name: string;
    nativeName?: string;
    code: string;
}

@Injectable({
    providedIn: 'root',
})
export class ValueLists {
    static BASE_URI = 'value-lists';
    constructor(private httpClient: HttpCacheClient) {}

    public get(names: (keyof SelectOptionLists | string)[], params: object = {}): BackendResponse<SelectOptionLists> {
        return this.httpClient.getWithCache(`${ValueLists.BASE_URI}/${names.join(',')}`, params);
    }

    public clearCache() {
        this.httpClient.clearCache();
    }
}
