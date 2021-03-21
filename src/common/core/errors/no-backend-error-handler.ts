import {ErrorHandler} from '@angular/core';
import * as Raven from 'raven-js';
import {Settings} from '../config/settings.service';
import {ignoredErrors} from './ignored-errors';
import {RavenOptions} from 'raven-js';

export function noBackendErrorHandlerFactory(settings: Settings) {
    return new NoBackendErrorHandler(settings);
}

export class NoBackendErrorHandler extends ErrorHandler {

    /**
     * Whether sentry error logger is already installed.
     */
    protected installed = false;

    constructor(protected settings: Settings) {
        super();
    }

    public handleError(err: any, options?: RavenOptions): void {
        if ( ! err) {
            return;
        }

        super.handleError(err);

        // sentry did not install properly
        if ( ! this.installSentry()) {
            return;
        }

        Raven.captureException(err.originalError || err, options);
    }

    /**
     * Install sentry error logger.
     */
    protected installSentry(): boolean {
        if (this.installed) return true;

        // no sentry public key is set
        if ( ! this.settings.has('logging.sentry_public')) return false;

        // install
        Raven.config(this.settings.get('logging.sentry_public'), {
            release: this.settings.get('version'),
            ignoreErrors: ignoredErrors,
        }).install();

        return this.installed = true;
    }
}
