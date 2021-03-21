import {Params, Router} from '@angular/router';
import {BehaviorSubject, of, Subscription} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {PaginatedBackendResponse} from '@common/core/types/pagination/paginated-backend-response';
import {PaginationParams} from '@common/core/types/pagination/pagination-params';
import {Injectable} from '@angular/core';
import {LocalStorage} from '@common/core/services/local-storage.service';

@Injectable()
export class Paginator<T> {
    private subscription: Subscription;
    private params$ = new BehaviorSubject<PaginationParams>({});
    public paginatedOnce$ = new BehaviorSubject<boolean>(false);
    public loading$ = new BehaviorSubject(false);
    public response$ = new BehaviorSubject<{pagination: PaginationResponse<T>, [key: string]: any}>(null);
    public dontUpdateQueryParams = false;
    public perPageCacheKey: string = null;
    /** only true if data was already loaded from backend and it was empty */
    public noResults$ = this.response$.pipe(map(r => this.paginatedOnce$.value && r.pagination.data.length === 0));

    get params(): PaginationParams {
        return this.params$.value;
    }

    get currentPage(): number {
        return this.response$.value?.pagination?.current_page;
    }

    constructor(
        private router: Router,
        private http: AppHttpClient,
        private localStorage?: LocalStorage,
    ) {}

    public paginate(userParams: object = {}, url?: string, initialData?: PaginationResponse<T>) {
        // only use query params on first pagination, so query params can be removed via user params
        const queryParams = !this.subscription ? this.currentQueryParams() : {};
        const paginationParams = this.response$.value ? {
            perPage: this.response$.value.pagination.per_page,
            page: this.response$.value.pagination.current_page
        } : {};
        this.params$.next({...paginationParams, ...queryParams, ...userParams});

        if ( ! this.subscription) {
            this.init(url, initialData);
        }
    }

    public nextPage() {
        const current = this.response$.value.pagination.current_page;
        const total = this.response$.value.pagination.total;
        const next = current + 1;
        this.paginate({
            ...this.params$.value,
            page: !current || next > total ? current : next
        });
    }

    public previousPage() {
        const current = this.response$.value.pagination.current_page;
        this.paginate({
            ...this.params$.value,
            page: (current - 1) || 1
        });
    }

    public changePerPage(newPerPage: number) {
        if (newPerPage !== this.params$.value?.perPage) {
            if (this.perPageCacheKey) {
                this.localStorage.set(this.perPageCacheKey, newPerPage);
            }
            this.paginate({
                ...this.params$.value,
                perPage: newPerPage
            });
        }
    }

    public currentQueryParams(): Params {
        return this.router.routerState.root.snapshot.queryParams;
    }

    private init(uri: string, initialData?: PaginationResponse<T>) {
        this.subscription = this.params$.pipe(
            switchMap(params => {
                this.loading$.next(true);
                const firstPagination = !this.paginatedOnce$.value;
                if (firstPagination && this.perPageCacheKey && this.localStorage.get(this.perPageCacheKey)) {
                    params = {perPage: this.localStorage.get(this.perPageCacheKey), ...params};
                }

                // if we got initial pagination response (of 1st page)
                // return that instead of making 1st page http request
                const request = firstPagination && initialData ?
                    of({pagination: initialData}) :
                    this.http.get(uri, params);

                return (request as PaginatedBackendResponse<T>).pipe(
                    // can't use "finalize" here as it will complete after loading$.next(true)
                    // call above, which will prevent loading bar from showing
                    // if pagination request is cancelled and new one is queued
                    tap(() => {
                        this.updateQueryParams(params);
                        this.loading$.next(false);
                        this.paginatedOnce$.next(true);
                    }, () => {
                        this.loading$.next(false);
                        this.paginatedOnce$.next(true);
                    })
                ) as PaginatedBackendResponse<T>;
            })
        ).subscribe(response => {
            this.response$.next(response);
        });
    }

    private updateQueryParams(params = {}) {
        if (this.dontUpdateQueryParams) return;
        for (const key in params) {
            if (Array.isArray(params[key])) {
                params[key] = params[key].join(',');
            }
        }
        this.router.navigate([], {queryParams: params, replaceUrl: true});
    }

    public canLoadNextPage() {
        return this.response$.value &&
            this.currentPage < this.response$.value?.pagination?.last_page;
    }
}
