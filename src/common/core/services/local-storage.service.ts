import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LocalStorage {
    private readonly storage;

    constructor() {
        if (this.localStorageAvailable()) {
            this.storage = localStorage;
        } else {
            this.storage = null;
        }
    }

    /**
     * Retrieve specified item from local storage.
     */
    public get<T>(key: string, defaultValue?: T): any|T {
        if ( ! this.storage) return defaultValue;

        let value;
        try {
            value = JSON.parse(this.storage.getItem(key));
        } catch (e) {
            //
        }

        return value == null ? defaultValue : value;
    }

    /**
     * Store specified item in local storage.
     */
    public set(key: string, value: any) {
        if ( ! this.storage) return null;
        value = JSON.stringify(value);
        this.storage.setItem(key, value);
    }

    /**
     * Remove specified item from local storage.
     */
    public remove(key: string) {
        if ( ! this.storage) return null;
        this.storage.removeItem(key);
    }

    /**
     * Check if local storage is available.
     */
    public localStorageAvailable(): boolean {
        const test = 'test';

        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
}
