interface WebKitDirectoryEntry extends WebKitEntry {
    createReader(): WebKitDirectoryReader;
}

interface WebKitDirectoryReader {
    readEntries(successCallback: WebKitEntriesCallback, errorCallback?: WebKitErrorCallback): void;
}

interface WebKitEntry {
    readonly filesystem: WebKitFileSystem;
    readonly fullPath: string;
    readonly isDirectory: boolean;
    readonly isFile: boolean;
    readonly name: string;
}

interface WebKitFileEntry extends WebKitEntry {
    file(successCallback: WebKitFileCallback, errorCallback?: WebKitErrorCallback): void;
}

interface WebKitFileSystem {
    readonly name: string;
    readonly root: WebKitDirectoryEntry;
}

type WebKitEntriesCallback = ((entries: WebKitEntry[]) => void) | { handleEvent(entries: WebKitEntry[]): void; };

type WebKitErrorCallback = ((err: DOMError) => void) | { handleEvent(err: DOMError): void; };

type WebKitFileCallback = ((file: File) => void) | { handleEvent(file: File): void; };

interface File extends Blob {
    readonly webkitRelativePath: string;
}

interface HTMLInputElement extends HTMLElement {
    webkitdirectory: boolean;
}

interface Document {
    mozCancelFullScreen: () => void;
    CancelFullScreen: () => void;
    webkitExitFullscreen: () => void;
    msExitFullscreen: () => void;
    mozFullScreenElement: () => void;

    webkitFullscreenElement?: Element;
    mozFullscreenElement?: Element;
    msFullScreenElement?: Element;
}

interface HTMLElement {
    msRequestFullscreen: () => void;
    mozRequestFullScreen: () => void;
    webkitRequestFullScreen: () => void;
}
