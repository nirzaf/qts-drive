import {Injectable} from '@angular/core';
import {isAbsoluteUrl} from '@common/core/utils/is-absolute-url';

@Injectable({
    providedIn: 'root',
})
export class LazyLoaderService {
    private loadedAssets: {[key: string]: string|Promise<void>} = {};

    /**
     * Load js or css asset and return promise resolved on load event.
     */
    public loadAsset(url: string, params: {id?: string, force?: boolean, type?: 'js'|'css' , parentEl?: HTMLElement} = {type: 'js'}): Promise<any> {
        // script is already loaded, return resolved promise
        if (this.loadedAssets[url] === 'loaded' && !params.force) {
            return new Promise((resolve) => resolve());

            // script has never been loaded before, load it, return promise and resolve on script load event
        } else if (!this.loadedAssets[url] || (params.force && this.loadedAssets[url] === 'loaded')) {
            this.loadedAssets[url] = new Promise((resolve, reject) => {
                const finalUrl = isAbsoluteUrl(url) ? url : 'client/assets/' + url;
                const finalId = params.id || url.split('/').pop();

                if (params.type === 'css') {
                    this.loadStyleAsset(finalUrl, finalId, resolve);
                } else {
                    this.loadScriptAsset(finalUrl, finalId, resolve, params.parentEl);
                }
            });
            return this.loadedAssets[url] as Promise<void>;

            // script is still loading, return existing promise
        } else {
            return this.loadedAssets[url] as Promise<void>;
        }
    }

    private loadStyleAsset(url, id: string, resolve: (value?: any | PromiseLike<any>) => void) {
        const style = document.createElement('link');
        style.rel = 'stylesheet';
        style.id = id || url.split('/').pop();
        style.href = url;

        style.onload = () => {
            this.loadedAssets[url] = 'loaded';
            resolve();
        };

        document.head.appendChild(style);
    }

    private loadScriptAsset(url, id: string, resolve: (value?: any | PromiseLike<any>) => void, parentEl?: HTMLElement) {
        const s: HTMLScriptElement = document.createElement('script');
        s.async = true;
        s.id = id || url.split('/').pop();
        s.src = url;

        s.onload = () => {
            this.loadedAssets[url] = 'loaded';
            resolve();
        };

        (parentEl || document.body).appendChild(s);
    }
}
