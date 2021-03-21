export interface PaginationParams {
    with?: string|string[];
    withCount?: string|string[];
    query?: string;
    perPage?: number;
    page?: number;
    order?: string;
    orderDir?: string;
    orderBy?: string;
}
