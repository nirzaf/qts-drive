import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Settings} from '@common/core/config/settings.service';
import {Deselect, Navigate, Select, SetConfig} from '@common/shared/appearance/commands/appearance-commands';
import {AppearanceCommand} from '@common/shared/appearance/commands/appearance-command';
import {APPEARANCE_TOKEN} from '@common/shared/appearance/appearance-listener.service';
import {BehaviorSubject, fromEvent, Observable, ReplaySubject} from 'rxjs';
import {filter, finalize, share} from 'rxjs/operators';
import {slugifyString} from '@common/core/utils/slugify-string';
import {CssThemeColors} from '@common/core/types/models/CssTheme';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {Toast} from '@common/core/ui/toast.service';
import {GenericBackendResponse} from '@common/core/types/backend-response';
import {removeDuplicateSlashes} from '@common/core/utils/remove-duplicate-slashes';
import {AppearanceEditorConfig, AppearanceEditorField} from '@common/admin/appearance/appearance-editor-config.token';
import deepmerge from 'deepmerge';

export interface EditorChanges {
    [key: string]: string|number|object;
    colors?: CssThemeColors;
}

@Injectable({
    providedIn: 'root'
})
export class AppearanceEditor {
    public activePanel$ = new BehaviorSubject<AppearanceEditorField>(null);
    public defaultSettings: {[key: string]: any} = {};
    public initiated$ = new ReplaySubject(1);
    private previewWindow: Window;

    public loading$ = new BehaviorSubject<boolean>(false);
    private saveRequest: (changes: EditorChanges) => Observable<void>;
    public changes$ = new BehaviorSubject<EditorChanges>(null);
    public config: AppearanceEditorConfig;

    constructor(
        private settings: Settings,
        private router: Router,
        private http: AppHttpClient,
        private toast: Toast,
    ) {}

    public addChanges(value: EditorChanges) {
        this.changes$.next({...this.changes$.value, ...value});
    }
    
    public openPanel(name: string) {
        const panel = this.config.sections.find(value => {
            return slugifyString(value.name) === name;
        });
        this.activePanel$.next(panel);
        this.navigate(panel);
    }

    public init(iframe: HTMLIFrameElement, defaultSettings: {name: string, value: any}[], config: AppearanceEditorConfig[]) {
        // listen for 'initiated' event from iframe window
        fromEvent(window, 'message')
            .pipe(filter((e: MessageEvent) => {
                return e.data === APPEARANCE_TOKEN && (new URL(e.origin).hostname) === window.location.hostname;
            })).subscribe(() => {
                this.initiated$.next(true);
                this.initiated$.complete();
                if (this.activePanel$.value) {
                    this.navigate(this.activePanel$.value);
                }
            });

        defaultSettings.forEach(setting => {
            if (setting.name === 'env') {
                this.defaultSettings = {...this.defaultSettings, ...setting.value};
            } else {
                this.defaultSettings[setting.name] = setting.value;
            }
        });

        this.initConfig(config);
        this.initIframe(iframe);
        return this.initiated$;
    }

    public saveChanges(changes?: EditorChanges): Observable<unknown> {
        if (changes) {
            this.addChanges(changes);
        }
        this.loading$.next(true);
        const request = this.saveRequest ?
            this.saveRequest :
            c => this.http.post<GenericBackendResponse<any>>('admin/appearance', c);
        const observable = request(this.changes$.value)
            .pipe(
                finalize(() => this.loading$.next(false)),
                share()
            );
            observable.subscribe(() => {
                this.changes$.next(null);
                this.toast.open('Appearance saved');
            });
        return observable;
    }

    public setSaveRequest(request: (changes: EditorChanges) => Observable<void>) {
        this.saveRequest = request;
    }

    public closeActivePanel() {
        this.router.navigate(['/admin/appearance']);
    }

    public navigate(panelConfig: AppearanceEditorField) {
        const route = panelConfig?.route || this.config.defaultRoute;
        this.postMessage(new Navigate(route, panelConfig?.queryParams));
    }

    public setConfig(key: string, value: string|number) {
        this.postMessage(new SetConfig(key, value));
    }

    public selectNode(selector: string, index = 0) {
        if ( ! selector) return;
        this.postMessage(new Select(selector, index));
    }

    public deselectNode() {
        this.postMessage(new Deselect());
    }

    public postMessage(command: AppearanceCommand) {
        this.previewWindow.postMessage(command, '*');
    }

    public currentValue(key: string) {
        if (key.startsWith('env.') || key.startsWith('custom-code.')) {
            return this.defaultSettings[key];
        } else {
            return this.settings.get(key);
        }
    }

    private initConfig(config: AppearanceEditorConfig[]) {
        const merged = deepmerge.all(config) as AppearanceEditorConfig;
        merged.sections = merged.sections.sort((a, b) => (a.position > b.position) ? 1 : -1);
        if ( ! merged.defaultRoute) merged.defaultRoute = '/';
        if (this.settings.get('site.has_mobile_app')) {
            merged.menus.positions.push('mobile-app-about');
        }
        this.config = merged;
    }

    private initIframe(iframe: HTMLIFrameElement) {
        const url = this.settings.getBaseUrl() + this.config.defaultRoute + `?be-preview-mode=${APPEARANCE_TOKEN}`;
        iframe.src = removeDuplicateSlashes(url);
        this.previewWindow = iframe.contentWindow;
    }
}
