import {Injectable} from '@angular/core';
import {Router, RouterEvent} from '@angular/router';
import {Settings} from '../../core/config/settings.service';
import {AppearanceCommand} from './commands/appearance-command';
import {CommandTypes} from './commands/command-types';
import {AllCommands} from './commands/appearance-commands';
import {createSelectorBox} from './utils/create-selector-box';
import {selectNode} from './utils/select-node';
import {deselectNode} from './utils/deselect-node';
import {filter} from 'rxjs/operators';
import {Toast} from '../../core/ui/toast.service';

export const APPEARANCE_TOKEN = 't50b4BT5hWsvJMr7';

@Injectable({
    providedIn: 'root'
})
export class AppearanceListenerService {
    public active = false;

    private dom: Partial<{
        selectBox: HTMLDivElement;
        colors: CSSStyleDeclaration;
    }> = {};

    constructor(
        private toast: Toast,
        private router: Router,
        private settings: Settings,
    ) {}

    public init() {
        this.active = window.location.search.includes(`be-preview-mode=${APPEARANCE_TOKEN}`);
        if ( ! this.active) return;
        this.listenForMessages();
        this.blockNotAllowedRoutes();
        this.createDomNodes();
        window.parent.postMessage(APPEARANCE_TOKEN, '*');
    }

    private listenForMessages() {
        window.addEventListener('message', e => {
            if (this.isAppearanceEvent(e) && this.eventIsTrusted(e)) {
                this.handleCommand(e.data);
            }
        });
    }

    private handleCommand(command: AllCommands|any) {
        // TODO: fix command data typings (remove "any")
        switch (command.type) {
            case (CommandTypes.Navigate):
                return this.router.navigate([command.route], {queryParams: command.queryParams});
            case (CommandTypes.SetConfig):
                return this.settings.set(command.key, command.value);
            case (CommandTypes.Select):
                return selectNode(command.selector, command.index, this.dom.selectBox);
            case (CommandTypes.Deselect):
                return deselectNode(this.dom.selectBox);
            case (CommandTypes.SetColors):
                return this.dom.colors.setProperty(command.key, command.value);
            case (CommandTypes.SetCustomCss):
               return this.renderCustomCode('css', command.content);
            case (CommandTypes.SetCustomHtml):
                return this.renderCustomCode('html', command.content);
        }
    }

    private renderCustomCode(type: 'html'|'css', content: string) {
        const parent = type === 'html' ? document.body : document.head,
            nodeType = type === 'html' ? 'div' : 'style';
        let customNode = parent.querySelector('#be-custom-css');
        if ( ! customNode) {
            customNode = document.createElement(nodeType);
            customNode.id = 'be-custom-css';
            parent.appendChild(customNode);
        }
        return customNode.innerHTML = content;
    }

    private eventIsTrusted(e: MessageEvent): boolean {
        return (new URL(e.origin).hostname) === window.location.hostname;
    }

    private isAppearanceEvent(e: MessageEvent) {
        const data = e.data as AppearanceCommand;
        return data && (data.type in CommandTypes);
    }

    private createDomNodes() {
        this.dom.selectBox = createSelectorBox();
        this.dom.colors = document.documentElement.style;
    }

    private blockNotAllowedRoutes() {
        const blockedRoutes = [];
        this.router.events
            .pipe(filter(e => e.toString().indexOf('NavigationStart') === 0))
            .subscribe((e: RouterEvent) => {
                if (blockedRoutes.find(route => e.url.indexOf(route) > -1)) {
                    // prevent navigation to routes not specified in config
                    const current = this.router.url.split('?')[0];
                    this.router.navigate([current], {queryParamsHandling: 'preserve'});

                    setTimeout(() => this.toast.open('That page is not supported by the editor.'));
                }
            });
    }
}

