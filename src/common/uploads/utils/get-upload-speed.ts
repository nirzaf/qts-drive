import { ChunkHttpProgressEvent } from '@common/uploads/chunked/chunk-http-event';

export function getUploadSpeed(e: ChunkHttpProgressEvent, uploadStarted: number) {
    const loaded = e.initiallyLoaded ? e.loaded - e.initiallyLoaded : e.loaded;
    if ( ! loaded) return 0;
    const timeElapsed = (new Date() as any) - uploadStarted;
    return loaded / (timeElapsed / 1000);
}
