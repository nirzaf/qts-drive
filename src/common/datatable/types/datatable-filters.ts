import {Model} from '../../core/types/models/model';

export type DatatableFilterValue = Model|string|number;

export interface DatatableFilters {
    query?: string;
    [key: string]: DatatableFilterValue;
}
