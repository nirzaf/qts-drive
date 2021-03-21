import {Injectable} from '@angular/core';
import {Observable, fromEvent} from 'rxjs';
import {filter} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class BrowserEvents {
    /**
     * Click event for every element inside app component.
     */
    public globalClick$: Observable<MouseEvent>;

    /**
     * Browser KeyDown event.
     */
    public globalKeyDown$: Observable<KeyboardEvent>;

    /**
     * Create observables for document events.
     */
    public subscribeToEvents(el) {
        // document click event
        this.globalClick$ = fromEvent(el, 'click');

        // document keyDown event
        this.globalKeyDown$ = fromEvent(document, 'keydown')
            .pipe(filter(() => !BrowserEvents.userIsTyping())) as Observable<KeyboardEvent>;
    }

    /**
     * Check if an input or textarea element is currently focused.
     */
    public static userIsTyping() {
        const inputs = ['input', 'textarea'],
              tagName = document.activeElement.tagName;

        if ( ! tagName) return true;

        return inputs.indexOf(tagName.toLowerCase()) > -1;
    }
}
