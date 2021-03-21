import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material/snack-bar';
import {Settings} from '../config/settings.service';
import {Translations} from '../translations/translations.service';
import {ComponentType} from '@angular/cdk/portal';

export const TOAST_WITH_ACTION_DURATION = 15000;

export interface ToastMessage {
    message: string;
    replacements: {[key: string]: string|number};
}

export interface ToastConfig {
    duration?: number;
    action?: string;
}

@Injectable({
    providedIn: 'root'
})
export class Toast {
    constructor(
        private settings: Settings,
        private i18n: Translations,
        private snackbar: MatSnackBar
    ) {}

    public open(message: string|ToastMessage, config: ToastConfig = {}): MatSnackBarRef<SimpleSnackBar> {
        if ( ! config.duration && config.duration !== 0) {
            config.duration = config.action ? TOAST_WITH_ACTION_DURATION : 3000;
        }

        const translatedMsg = typeof message === 'string' ?
            this.i18n.t(message) :
            this.i18n.t(message.message, message.replacements);

        return this.snackbar.open(this.i18n.t(translatedMsg), this.i18n.t(config.action), {duration: config.duration});
    }

    public openComponent<T>(component: ComponentType<T>, config?: {duration?: number, data?: {[key: string]: any}}) {
        return this.snackbar.openFromComponent(component, config);
    }
}
