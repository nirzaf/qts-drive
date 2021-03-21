import {Inject, Injectable, Injector} from '@angular/core';
import {FileEntry} from '../uploads/types/file-entry';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {AVAILABLE_PREVIEWS, DefaultPreviews} from './available-previews';
import {ComponentPortal, PortalInjector} from '@angular/cdk/portal';
import {CURRENT_PREVIEW_FILE} from './current-preview-file';
import {DefaultPreviewComponent} from './default-preview/default-preview.component';
import {filter} from 'rxjs/operators';
import {PREVIEW_URL_TRANSFORMER, PreviewUrlTransformer} from './preview-url-transformer';

interface PreviewFilesMeta {
    entry?: FileEntry;
    pointer?: number;
    total?: number;
    haveNext?: boolean;
    havePrevious?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class PreviewFilesService {
    private files: FileEntry[] = [];
    private portal = new BehaviorSubject(null);
    private meta: BehaviorSubject<PreviewFilesMeta> = new BehaviorSubject({});
    private previewUriTransformer: PreviewUrlTransformer|null = null;
    public download = new Subject();

    constructor(
        @Inject(AVAILABLE_PREVIEWS) private availablePreviews: DefaultPreviews,
        private injector: Injector,
    ) {}

    public pagination(): Observable<PreviewFilesMeta> {
        return this.meta
            .pipe(filter(data => data && !!data.entry));
    }

    public getCurrent(): FileEntry {
        return this.meta.value.entry;
    }

    public getAllEntries() {
        return this.files;
    }

    public getPortal(): Observable<ComponentPortal<any>> {
        return this.portal.asObservable();
    }

    public showNext() {
        if ( ! this.meta.value.haveNext) return;
        this.updateMeta('next');
        this.updatePortal();
    }

    public showPrevious() {
        if ( ! this.meta.value.havePrevious) return;
        this.updateMeta('previous');
        this.updatePortal();
    }

    private updateMeta(dir?: 'next'|'previous'|number) {
        let newPointer = 0;

        if (typeof dir === 'string') {
            const oldPointer = this.meta.value.pointer;
            newPointer = dir === 'next' ? oldPointer + 1 : oldPointer - 1;
        } else if (typeof dir === 'number') {
            newPointer = dir;
        }

        this.meta.next({
            pointer: newPointer,
            entry: this.files[newPointer],
            total: this.files.length,
            haveNext: (newPointer + 1) < this.files.length,
            havePrevious: (newPointer - 1) > -1,
        });
    }

    private updatePortal() {
        const current = this.getCurrent();
        const comp = (current && this.availablePreviews[current.type]) || DefaultPreviewComponent;
        this.portal.next(new ComponentPortal(comp, null, this.createInjector()));
    }

    public set(files: FileEntry[], activeFile?: number) {
        if ( ! files || files.length === 0) return;
        this.files = files.filter(entry => entry.type !== 'folder');
        this.updateMeta(activeFile);
        this.updatePortal();
    }

    private createInjector(): PortalInjector {
        const injectionTokens = new WeakMap();

        // set currently active preview file
        injectionTokens.set(CURRENT_PREVIEW_FILE, this.getCurrent());

        // override preview backend uri, if specified
        if (this.previewUriTransformer) {
            injectionTokens.set(PREVIEW_URL_TRANSFORMER, this.previewUriTransformer);
        }

        return new PortalInjector(this.injector, injectionTokens);
    }

    public destroy() {
        this.meta.next({});
        this.files = null;
        this.portal.next(null);
    }

    /**
     * Provide transformer function for preview file backend url.
     * (for changing base uri, adding url params etc)
     */
    public setPreviewUriTransformer(transformer: PreviewUrlTransformer) {
        this.previewUriTransformer = transformer;
    }
}
