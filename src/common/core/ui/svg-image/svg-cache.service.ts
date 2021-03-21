import {Inject, Injectable, Optional} from '@angular/core';
import {finalize, map, share, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {DOCUMENT} from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class SvgCacheService {
    private cache = new Map<string, SVGElement>();
    private inProgressUrlFetches = new Map<string, Observable<string>>();

    constructor(
        private http: HttpClient,
        @Optional() @Inject(DOCUMENT) private document: Document
    ) {}

    public get(name: string): Observable<SVGElement> {
        const fileName = name.endsWith('.svg') ? name : `${name}.svg`;

        if (this.cache.get(fileName)) {
            return of(cloneSvg(this.cache.get(fileName)));
        }

        return this.fetchIcon(fileName).pipe(
            map(svgText => this.svgElementFromString(svgText, fileName)),
            tap(svg => this.cache.set(fileName, svg)),
            map(svg => cloneSvg(svg))
        );
    }

    private fetchIcon(fileName: string) {
        const inProgressFetch = this.inProgressUrlFetches.get(fileName);
        if (inProgressFetch) {
            return inProgressFetch;
        }

        const req = this.http.get(`client/assets/images/illustrations/${fileName}`, {responseType: 'text'}).pipe(
            finalize(() => this.inProgressUrlFetches.delete(fileName)),
            share(),
        );
        this.inProgressUrlFetches.set(fileName, req);
        return req;
    }

    private svgElementFromString(str: string, fileName: string = ''): SVGElement {
        const div = this.document.createElement('DIV');
        div.innerHTML = str;
        const svg = div.querySelector('svg') as SVGElement;

        if (!svg) {
            throw Error(`<svg> tag not found for ${fileName}`);
        }

        return svg;
    }
}

function cloneSvg(svg: SVGElement): SVGElement {
    return svg.cloneNode(true) as SVGElement;
}
