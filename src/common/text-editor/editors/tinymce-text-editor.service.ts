import {Injectable, NgZone} from '@angular/core';
import {Settings} from '../../core/config/settings.service';
import {LazyLoaderService} from '../../core/utils/lazy-loader.service';
import {BreakpointsService} from '../../core/ui/breakpoints.service';
import {Editor, EditorManager} from 'tinymce';
import {Translations} from '../../core/translations/translations.service';

const EDITOR_TOOLBAR_HEIGHT = 74;

declare const tinymce: EditorManager;

@Injectable({
    providedIn: 'root'
})
export class TinymceTextEditor {
    private bootstrapPromise: Promise<Editor> | boolean;
    private bootstrapPromiseResolve: any;
    private config: { [key: string]: any };
    public tinymceInstance: Editor|any;

    constructor(
        private settings: Settings,
        private zone: NgZone,
        private lazyLoader: LazyLoaderService,
        private breakpoints: BreakpointsService,
        private i18n: Translations,
    ) {
        this.makeBootstrapPromise();
    }

    public reset() {
        if (!this.editorIsReady()) return;
        this.tinymceInstance.setContent('');
        this.tinymceInstance.undoManager.clear();
    }

    public focus() {
        this.waitForEditor().then(() => {
            this.tinymceInstance.focus(false);
        });
    }

    public hasUndo(): boolean {
        return this.editorIsReady() && this.tinymceInstance.undoManager.hasUndo();
    }

    public hasRedo(): boolean {
        return this.editorIsReady() && this.tinymceInstance.undoManager.hasRedo();
    }

    /**
     * Queries the current state for specified tinymce command.
     * For example if the current selection is "bold".
     */
    public queryCommandState(name: string): boolean | number {
        return this.editorIsReady() && this.tinymceInstance.queryCommandState(name);
    }

    public execCommand(name: string, value: string | number = null) {
        this.waitForEditor().then(() => {
            this.zone.run(() => {
                this.tinymceInstance.execCommand(name, false, value);
            });
        });
    }

    public getContents(params?: Object): string {
        if (!this.editorIsReady()) return '';
        return this.tinymceInstance.getContent(params);
    }

    public setContents(contents: string) {
        this.waitForEditor().then(() => {
            if (!this.tinymceInstance.undoManager) return;

            this.tinymceInstance.undoManager.transact(() => {
                this.tinymceInstance.setContent(contents);
            });

            this.tinymceInstance.selection.setCursorLocation();
            this.tinymceInstance.nodeChanged();
            this.tinymceInstance.execCommand('mceResize');
        });
    }

    /**
     * Insert specified contents at the end of tinymce.
     */
    public insertContents(contents) {
        this.waitForEditor().then(() => {
            this.tinymceInstance.execCommand('mceInsertContent', false, contents);
            setTimeout(() => this.tinymceInstance.selection.collapse());
        });
    }

    public insertImage(url: string) {
        this.waitForEditor().then(() => {
            this.insertContents('<img src="' + url + '"/>');
            setTimeout(() => this.execCommand('mceAutoResize'), 500);
        });
    }

    public waitForEditor(): Promise<Editor> {
        // editor already bootstrapped
        if (this.tinymceInstance) {
            return new Promise(resolve => resolve(this.tinymceInstance));
        }
        // editor is still bootstrapping
        if (this.bootstrapPromise) {
            return this.bootstrapPromise as Promise<Editor>;
        }
    }

    public setConfig(config: object) {
        this.config = config;
        this.loadTinymce().then(() => {
            this.initTinymce();
        });
    }

    private editorIsReady(): boolean {
        return !this.bootstrapPromise && !!this.tinymceInstance && !!this.tinymceInstance.undoManager;
    }

    private loadTinymce(): Promise<any> {
        return this.lazyLoader.loadAsset('js/tinymce/tinymce.min.js', {type: 'js'});
    }

    private initTinymce() {
        const config: any = {
            target: this.config.textAreaEl.nativeElement,
            plugins: ['link', 'codesample', 'paste', 'autoresize'],
            branding: false,
            browser_spellcheck: true,
            max_height: this.config.maxHeight,
            min_height: this.config.minHeight,
            autoresize_on_init: false,
            paste_as_text: true,
            elementpath: false,
            statusbar: false,
            entity_encoding: 'raw',
            menubar: false,
            convert_urls: false,
            forced_root_block: false,
            document_base_url : document.baseURI,
            element_format: 'html',
            body_class: 'editor-body',
            content_style: `html {font-size: 62.5%;}
.editor-body {font-size: 1.4rem;font-family: "Roboto", "Helvetica Neue", sans-serif;color: rgba(0, 0, 0, .87);}
img {max-width: 100%}
code[class*=language-], pre[class*=language-] {font-size: inherit;} .mce-preview-object {border: none;}`,
            content_css: ['https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic'],
            default_link_target: '_blank',
            link_assume_external_targets: true,
            target_list: false,
            link_title: false,
            image_dimensions: false,
            image_description: false,
            setup: editor => {
                this.tinymceInstance = editor;
                editor.on('change', () => this.config.onChange.emit(editor.getContent()));

                editor.on('click', () => {
                    // need to run angular zone on editor (iframe) click
                    // so custom editor buttons are highlighted properly
                    this.zone.run(() => {
                    });
                });

                editor.shortcuts.add('ctrl+13', 'desc', () => {
                    this.zone.run(() => {
                        this.config.onChange.emit(editor.getContent());
                        this.config.onCtrlEnter.emit();
                    });
                });
            },
            init_instance_callback: () => {
                this.bootstrapPromise = false;
                this.bootstrapPromiseResolve(this.tinymceInstance);
            }
        };

        // need to show toolbar on mobile, otherwise tinymce will error out
        if (!this.breakpoints.isMobile$.value) {
            config.toolbar = false;
        }

        if (this.config['showAdvancedControls']) {
            config.plugins = config.plugins.concat(['media', 'hr', 'visualblocks', 'visualchars', 'wordcount']);
            config.forced_root_block = 'p';
            config.statusbar = true;
            config.autoresize_on_init = true;
            config.extended_valid_elements = 'svg[*],use[*],iframe[src|frameborder|width|height|allow=*|allowfullscreen],script[src]';
            config.elementpath = true;
            config.content_css.push(this.settings.getAssetUrl() + 'css/advanced-editor-styles.css');
            config.target_list = [
                {title: this.i18n.t('Current window'), value: ''},
                {title: this.i18n.t('New Window'), value: '_blank'},
            ];
            config.codesample_languages = [
                { text: 'HTML/XML', value: 'markup' },
                { text: 'JavaScript', value: 'javascript' },
                { text: 'CSS', value: 'css' },
                { text: 'Shell', value: 'shell-session' },
                { text: 'Bash', value: 'bash' },
                { text: 'PHP', value: 'php' },
                { text: 'Ruby', value: 'ruby' },
                { text: 'Python', value: 'python' },
                { text: 'Java', value: 'java' },
                { text: 'C', value: 'c' },
                { text: 'C#', value: 'csharp' },
                { text: 'C++', value: 'cpp' }
            ];
        }

        if (this.config['minHeight'] === 'auto') {
            const height = this.config.editorEl.nativeElement.parentElement.offsetHeight - EDITOR_TOOLBAR_HEIGHT - 4;
            config.min_height = height;
            config.max_height = height;
        }

        tinymce.init(config);
    }

    public destroyEditor() {
        // catch error that sometimes occurs on EDGE when
        // trying to destroy editor that is no longer in the DOM
        try {
            if (this.tinymceInstance) {
                this.tinymceInstance.remove();
            }

            this.tinymceInstance = null;
            this.makeBootstrapPromise();
        } catch (e) {
            //
        }
    }

    /**
     * Create a tinymce bootstrap promise.
     */
    private makeBootstrapPromise() {
        this.bootstrapPromise = new Promise(resolve => this.bootstrapPromiseResolve = resolve);
    }
}
