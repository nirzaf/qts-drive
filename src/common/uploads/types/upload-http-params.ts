export interface UploadHttpParams {
    parentId?: number|null;
    relativePath?: string;
    diskPrefix?: string;
    disk?: 'public'|'private';
}
