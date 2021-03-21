import {InjectionToken} from '@angular/core';

export const SUPPORTS_NATIVE_SCROLLBAR_STYLING = new InjectionToken<boolean>('SUPPORTS_NATIVE_SCROLLBAR_STYLING', {
    providedIn: 'root',
    factory: () => {
        // Detect IE, does not support custom scrollbars
        if (navigator.userAgent.indexOf('MSIE') !== -1
            || navigator.appVersion.indexOf('Trident/') > -1) {
            return false;
        }

        // Tested Element
        const test = document.createElement('div');
        test.className = '__sb-test';
        test.style.overflow = 'scroll';
        test.style.width = '40px';

        // Is there another way to style pseudo-elements in JS ?
        const style = document.createElement('style');
        style.innerHTML = '.__sb-test::-webkit-scrollbar { width: 0px; }';

        // Apply
        test.appendChild(style);
        document.body.appendChild(test);

        // If css scrollbar is supported, than the scrollWidth should not be impacted
        const result = test.scrollWidth == 40;

        // Cleaning
        document.body.removeChild(test);

        return result;
    }
});
