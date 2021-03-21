import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import {SvgCacheService} from './svg-cache.service';
import {take} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
    selector: 'svg-image',
    templateUrl: './svg-image.component.html',
    styleUrls: ['./svg-image.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'role': 'img',
    }
})
export class SvgImageComponent implements OnChanges, OnDestroy {
    @Input() name: string;
    private currentSvgFetch: Subscription;

    constructor(
        private cache: SvgCacheService,
        private el: ElementRef<HTMLElement>,
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        const svgIconChanges = changes.name;

        if (svgIconChanges) {
            this.currentSvgFetch?.unsubscribe();
            if (this.name) {
                this.currentSvgFetch = this.cache.get(this.name)
                    .pipe(take(1))
                    .subscribe(svg => this.setSvgElement(svg));
            }
        } else if (svgIconChanges.previousValue) {
            this.clearSvgElement();
        }
    }

    public ngOnDestroy(): void {
        this.currentSvgFetch?.unsubscribe();
    }

    private setSvgElement(svg: SVGElement) {
        this.clearSvgElement();

        // Workaround for IE11 and Edge ignoring `style` tags inside dynamically-created SVGs.
        // See: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/10898469/
        // Do this before inserting the element into the DOM, in order to avoid a style recalculation.
        const styleTags = svg.querySelectorAll('style') as NodeListOf<HTMLStyleElement>;

        for (let i = 0; i < styleTags.length; i++) {
            styleTags[i].textContent += ' ';
        }

        this.el.nativeElement.appendChild(svg);
    }

    private clearSvgElement() {
        const layoutElement = this.el.nativeElement;
        let childCount = layoutElement.childNodes.length;

        // Remove existing non-element child nodes and SVGs, and add the new SVG element. Note that
        // we can't use innerHTML, because IE will throw if the element has a data binding.
        while (childCount--) {
            const child = layoutElement.childNodes[childCount];

            // 1 corresponds to Node.ELEMENT_NODE. We remove all non-element nodes in order to get rid
            // of any loose text nodes, as well as any SVG elements in order to remove any old icons.
            if (child.nodeType !== 1 || child.nodeName.toLowerCase() === 'svg') {
                layoutElement.removeChild(child);
            }
        }
    }

}
