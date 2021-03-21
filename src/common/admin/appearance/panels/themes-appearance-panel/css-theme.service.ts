import {Injectable} from '@angular/core';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {BackendResponse} from '@common/core/types/backend-response';
import {CssTheme} from '@common/core/types/models/CssTheme';
import {PaginatedBackendResponse} from '@common/core/types/pagination/paginated-backend-response';

const BASE_URI = 'css-theme';

@Injectable({
    providedIn: 'root'
})
export class CssThemeService {
    constructor(private http: AppHttpClient) {}

    public all(): PaginatedBackendResponse<CssTheme> {
        return this.http.get(BASE_URI);
    }

    public create(params: Partial<CssTheme>): BackendResponse<{ theme: CssTheme }> {
        return this.http.post(BASE_URI, params);
    }

    public update(id, params: Partial<CssTheme>): BackendResponse<{ theme: CssTheme }> {
        return this.http.put(`${BASE_URI}/${id}`, params);
    }

    public delete(ids: number[]): BackendResponse<void> {
        return this.http.delete(`${BASE_URI}/${ids}`);
    }
}
