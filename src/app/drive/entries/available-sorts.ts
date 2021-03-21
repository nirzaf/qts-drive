export const AVAILABLE_SORTS: DriveSortOption[] = [
    {name: 'file_size', viewName: 'Size'},
    {name: 'name', viewName: 'Name'},
    {name: 'updated_at', viewName: 'Last Modified'},
    {name: 'created_at', viewName: 'Upload Date'},
    {name: 'type', viewName: 'Type'},
    {name: 'extension', viewName: 'Extension'},
];

export interface DriveSortOption {
    name: SortColumn;
    viewName: string;
}

export type SortColumn = 'file_size' | 'name' | 'updated_at' | 'created_at' | 'type' | 'extension';
export type SortDirection = 'desc'|'asc';

export interface SortValue {
    column: SortColumn;
    direction: SortDirection;
}
