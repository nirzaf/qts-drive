export function getUploadProgress(completed: number, total: number): number {
    return Math.floor(100 * completed / total);
}
