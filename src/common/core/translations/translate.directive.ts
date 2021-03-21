import {AfterViewInit, Directive, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {Subscription} from 'rxjs';
import {Translations} from './translations.service';
import {Settings} from '../config/settings.service';

@Directive({
    selector: '[trans], [trans-placeholder], [trans-title]'
})
export class TranslateDirective implements AfterViewInit, OnChanges, OnDestroy {
    @Input() transValues: {[key: string]: string|number};
    private subscriptions: Subscription[] = [];
    private originalValue: string;

    constructor(
        private el: ElementRef,
        private i18n: Translations,
        private settings: Settings
    ) {}

    ngAfterViewInit() {
        const sub = this.i18n.localizationChange.subscribe(() => this.translate());
        this.subscriptions.push(sub);
        this.translate();
    }

    ngOnChanges(changes: SimpleChanges) {
        if ( ! changes.firstChange) {
            this.translate();
        }
    }

    private translate() {
        if (!this.settings.get('i18n.enable') && !this.transValues) {
            return;
        }

        const el = this.el.nativeElement;

        // translate placeholder
        if (el.getAttribute('placeholder')) {
            const key = el.getAttribute('placeholder');
            el.setAttribute('placeholder', this.i18n.t(key));

        // translate html5 title
        } else if (el.getAttribute('title')) {
            const key = el.getAttribute('title');
            el.setAttribute('title', this.i18n.t(key));

        // translate node text content
        } else {
            this.translateTextContent(el);
        }
    }

    private translateTextContent(el: HTMLElement) {
        const children = Array.from(el.childNodes);

        // make sure text nodes are first
        children.sort((a, b) => a.nodeType === Node.TEXT_NODE ? -1 : 1);

        for (let i = 0; i < children.length; i++) {
            const child = children[i] as HTMLElement,
                textContent = child.textContent.trim();
            // make sure we don't translate newlines or single letters
            if (child.nodeType === Node.TEXT_NODE && textContent.length > 1) {
                if ( ! this.originalValue) {
                    this.originalValue = textContent;
                }
                return child.nodeValue = this.i18n.t(this.originalValue, this.transValues);
            } else {
                if (this.translateTextContent(child)) return;
            }
        }
    }

    ngOnDestroy() {
        this.subscriptions
            .filter(sub => !!sub)
            .forEach(sub => sub.unsubscribe());

        this.subscriptions = [];
    }
}
