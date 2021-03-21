export interface PaginationResponse<T> {
    data: T[];
    from: number;
    to: number;
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    path: string;
    next_page_url: string|null;
    prev_page_url: string|null;
}

export const EMPTY_PAGINATION_RESPONSE = {
    pagination: {data: []}
};
