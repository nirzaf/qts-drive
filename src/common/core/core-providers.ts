import {APP_CONFIG, DEFAULT_APP_CONFIG} from '@common/core/config/app-config';
import {HttpErrorHandler} from '@common/core/http/errors/http-error-handler.service';
import {BackendHttpErrorHandler} from '@common/core/http/errors/backend-http-error-handler.service';
import {APP_INITIALIZER, ErrorHandler, Provider} from '@angular/core';
import {Bootstrapper, init_app} from '@common/core/bootstrapper.service';
import {ravenErrorHandlerFactory} from '@common/core/errors/raven-error-handler';
import {Settings} from '@common/core/config/settings.service';
import {CurrentUser} from '@common/auth/current-user';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {MetaTagsInterceptor} from '@common/core/meta/meta-tags-interceptor';

export const CORE_PROVIDERS: Provider[] = [
    {
        provide: APP_CONFIG,
        useValue: DEFAULT_APP_CONFIG,
        multi: true,
    },
    {
        provide: HttpErrorHandler,
        useClass: BackendHttpErrorHandler,
    },
    {
        provide: APP_INITIALIZER,
        useFactory: init_app,
        deps: [Bootstrapper],
        multi: true,
    },
    {
        provide: ErrorHandler,
        useFactory: ravenErrorHandlerFactory,
        deps: [Settings, CurrentUser],
    },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: MetaTagsInterceptor,
        multi: true,
    },
];
