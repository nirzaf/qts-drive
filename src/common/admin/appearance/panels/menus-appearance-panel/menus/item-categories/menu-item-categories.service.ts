import {Injectable} from '@angular/core';
import {BackendResponse} from '@common/core/types/backend-response';
import {MenuItemCategory} from '@common/admin/appearance/panels/menus-appearance-panel/menus/item-categories/menu-item-category';
import {HttpCacheClient} from '@common/core/http/http-cache-client';

@Injectable({
    providedIn: 'root'
})
export class MenuItemCategoriesService {
    constructor(private http: HttpCacheClient) {}

    public get(): BackendResponse<{categories: MenuItemCategory[]}> {
        return this.http.getWithCache('admin/appearance/menu-categories');
    }
}
