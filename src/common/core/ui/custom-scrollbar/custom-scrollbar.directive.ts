import {AfterViewInit, Directive, ElementRef, Inject, Input, NgZone, OnDestroy, Renderer2} from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import {Subscription, Subject} from 'rxjs';
import {BreakpointsService} from '../breakpoints.service';
import {MutationObserverFactory} from '@angular/cdk/observers';
import {Settings} from '../../config/settings.service';
import {SUPPORTS_NATIVE_SCROLLBAR_STYLING} from './supports-native-scrollbar-styling';

@Directive({
    selector: '[customScrollbar]'
})
export class CustomScrollbarDirective implements AfterViewInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    /**
     * Minimum length for scrollbar drag handle.
     */
    @Input('customScrollbarMinLength') minLength = 100;

    /**
     * Whether horizontal scrollbar should be always hidden.
     */
    @Input() suppressX = true;

    /**
     * scrollTop value set via custom setScrollTop() method.
     * Perfect Scrollbar doesn't preserve scrollTop value on DOM
     * element for some reason, so we need to keep it here.
     */
    private scrollTop = 0;

    /**
     * Whether custom or native scrollbar is used.
     */
    private native = true;

    private scrollbar: PerfectScrollbar;

    private observer: MutationObserver;

    /**
     * Used for debouncing the emitted values to the observeContent event.
     */
    private debouncer = new Subject<MutationRecord[]>();

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private breakpoints: BreakpointsService,
        private ngZone: NgZone,
        private mutationObserverFactory: MutationObserverFactory,
        private config: Settings,
        @Inject(SUPPORTS_NATIVE_SCROLLBAR_STYLING) private supportsNativeStyling: boolean,
    ) {}

    ngAfterViewInit() {
        if (this.suppressX) {
            this.renderer.addClass(this.el.nativeElement, 'scroll-container');
        } else {
            this.renderer.addClass(this.el.nativeElement, 'scroll-container-x');
        }

        if (this.shouldUseNative()) return;

        this.scrollbar = new PerfectScrollbar(this.el.nativeElement, {
            minScrollbarLength: this.minLength,
            suppressScrollX: this.suppressX,
            useBothWheelAxes: !this.suppressX,
            wheelSpeed: 2
        });

        this.native = false;

        this.bindToContentChange();
    }

    /**
     * Update custom scrollbar.
     */
    public update() {
        if (this.native) return;
        this.scrollbar.update();
    }

    /**
     * Scroll container top to given value.
     */
    public setScrollTop(value = 0) {
        this.el.nativeElement.scrollTop = value;
        this.scrollTop = this.el.nativeElement.scrollTop;
        this.update();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];

        if ( ! this.native) {
            this.scrollbar.destroy();
        }

        // disable observer
        this.debouncer.complete();
        this.observer && this.observer.disconnect();
    }

    /**
     * Check whether native or custom scrollbar should be used.
     */
    private shouldUseNative(): boolean {
        if (this.config.get('vebto.forceCustomScrollbar')) return false;
        if (/Edge/.test(navigator.userAgent)) return false;
        if (this.breakpoints.isMobile$.value) return true;
        return this.supportsNativeStyling;
    }

    /**
     * Update custom scrollbar when element content changes.
     */
    private bindToContentChange() {
        this.observer = this.ngZone.runOutsideAngular(() => {
            return this.mutationObserverFactory.create((mutations: MutationRecord[]) => {
                this.debouncer.next(mutations);
            });
        });

        this.observer.observe(this.el.nativeElement, {
            childList: true,
            subtree: true
        });

        this.ngZone.runOutsideAngular(() => {
            this.debouncer.subscribe((mutations: MutationRecord[]) => this.update());
        });
    }
}
