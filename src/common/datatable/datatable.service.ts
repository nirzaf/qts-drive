import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Subscription} from 'rxjs';
import {Paginator} from '../shared/paginator.service';
import {debounceTime, filter, map, pairwise, skip, tap} from 'rxjs/operators';
import {DatatableFilters, DatatableFilterValue} from './types/datatable-filters';
import {DatatableSort} from './types/datatable-sort';
import {PaginationParams} from '../core/types/pagination/pagination-params';
import {removeNullFromObject} from '../core/utils/remove-null-from-object';
import {ComponentType} from '@angular/cdk/portal';
import {MatDialogConfig} from '@angular/material/dialog';
import {Modal} from '../core/ui/dialogs/modal.service';
import {ConfirmModalComponent} from '../core/ui/confirm-modal/confirm-modal.component';
import {DELETE_RESOURCE_MESSAGE} from './delete-resource-message';
import {PaginationResponse} from '../core/types/pagination/pagination-response';
import {sortDatatableData} from '@common/datatable/utils/sort-datatable-data';
import {Model} from '@common/core/types/models/model';
import {filterDatatableData} from '@common/datatable/utils/filter-datatable-data';
import {Router} from '@angular/router';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {LocalStorage} from '../core/services/local-storage.service';

export type DatatableStaticParams = Record<string, string|number|boolean|string[]>;

interface DatatableConfig<T> {
    uri?: string;
    staticParams?: DatatableStaticParams;
    initialData?: PaginationResponse<T>|T[];
    disableSort?: boolean;
    infiniteScroll?: boolean;
}

@Injectable()
export class DatatableService<T extends Model> {
    public sort$ = new BehaviorSubject<DatatableSort>({});
    public filters$ = new BehaviorSubject<DatatableFilters>({});
    public staticParams$ = new BehaviorSubject<DatatableStaticParams>({});
    public paginator = new Paginator<T>(this.router, this.http, this.localStorage);
    private paginatorSub: Subscription;
    private mainSub: Subscription;
    private ignoreNextParamChange = false;
    private originalData$ = new BehaviorSubject<T[]>([]);
    public data$ = new BehaviorSubject<T[]>([]);
    public selectedRows$ = new BehaviorSubject<number[]>([]);
    public config: DatatableConfig<T>;

    constructor(
        protected modal: Modal,
        protected router: Router,
        protected http: AppHttpClient,
        protected localStorage: LocalStorage,
    ) {}

    get data() {
        return this.data$.value;
    }

    set data(data: T[]) {
        const tableData = [...data];
        this.originalData$.next(tableData);
        this.data$.next(tableData);

        // Reset filters and sort without trigger data reload via pagination
        this.ignoreNextParamChange = true;
        this.reset();
    }

    public init(config: DatatableConfig<T> = {}) {
        this.config = config;
        this.staticParams$.next({...this.staticParams$.value, ...config.staticParams});
        if (config.uri) {
            this.connectToPaginator();
        } else if (config.initialData) {
            this.data = config.initialData as T[];
        }

        this.mainSub = combineLatest([this.sort$, this.filters$, this.staticParams$])
            .pipe(debounceTime(0), map(params => Object.assign({}, ...params))).subscribe((params: PaginationParams) => {
                if (this.ignoreNextParamChange) {
                    return this.ignoreNextParamChange = false;
                }
                params = removeNullFromObject(params);
                Object.entries(params).forEach(([key, value]) => {
                    if (typeof value === 'object' && value.id) {
                        params[`${key}Id`] = value.id;
                        delete params[key];
                    }
                });
                if (this.config.uri) {
                    this.paginator.paginate(params, this.config.uri, this.config.initialData as PaginationResponse<T>);
                } else if (Object.keys(params).length && this.data.length) {
                    this.applyLocalTransforms(params);
                }
            });

        return this;
    }

    private connectToPaginator() {
        this.paginatorSub = this.paginator.response$.pipe(pairwise()).subscribe(([prev, current]) => {
            // append data instead of overriding with next page data (infinite scroll).
            // if page did not change, we can assume that it was filter or sort
            // change and we should use only new data, even on infinite scroll
            const data = this.config.infiniteScroll && prev?.pagination?.current_page !== current.pagination.current_page ?
                [...this.data$.value, ...current.pagination.data] :
                current.pagination.data;
            this.data$.next(data);
        });
    }

    private applyLocalTransforms(params: PaginationParams) {
        let data = [...this.originalData$.value];
        if (params.query) {
            data = filterDatatableData<T>(data, params.query);
        }
        if (params.orderBy && params.orderDir) {
            data = sortDatatableData<T>(data, params.orderBy, params.orderDir);
        }
        this.data$.next(data);
    }

    public addFilter(key: keyof DatatableFilters, value: DatatableFilterValue) {
        this.filters$.next({
            ...this.filters$.value,
            [key]: value,
        });
    }

    public removeFilter(key: keyof DatatableFilters) {
        const filters = {...this.filters$.value};
        delete filters[key];
        this.filters$.next(filters);
    }

    public reset(staticParams: DatatableStaticParams = null) {
        this.filters$.next({});
        this.sort$.next({});
        this.selectedRows$.next([]);
        if (staticParams) {
            this.staticParams$.next(staticParams);
        }
    }

    public openCrupdateResourceModal(cmp: ComponentType<any>, data?: object, config?: MatDialogConfig) {
        return this.modal.open(cmp, data, config).beforeClosed()
            .pipe(
                filter(modifiedResource => !!modifiedResource),
                tap(() => this.reset())
            );
    }

    public confirmResourceDeletion(resource: string) {
        const data = {...DELETE_RESOURCE_MESSAGE, replacements: {resource}};
        return this.modal.open(ConfirmModalComponent, data).afterClosed()
            .pipe(filter(confirmed => confirmed));
    }

    public getCurrentParams() {
        return {
            ...this.sort$.value,
            ...this.filters$.value,
            ...this.staticParams$.value,
            ...this.paginator.params,
        };
    }

    public destroy() {
        this.paginatorSub?.unsubscribe();
        this.mainSub?.unsubscribe();
    }
}
