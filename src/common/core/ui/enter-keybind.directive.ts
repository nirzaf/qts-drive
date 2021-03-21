import {Directive, ElementRef, EventEmitter, OnInit, Output, Renderer2} from '@angular/core';

@Directive({
    selector: '[enterKeybind]'
})
export class EnterKeybindDirective implements OnInit {

    /**
     * Fired when enter key is pressed on element.
     */
    @Output() enterKeybind = new EventEmitter();

    /**
     * EnterKeybindDirective Constructor.
     */
    constructor(private renderer: Renderer2, private el: ElementRef) {}

    ngOnInit() {
        this.renderer.listen(this.el.nativeElement, 'keydown', e => {
            if (e.keyCode === 13) {
                e.preventDefault();
                e.stopPropagation();
                this.el.nativeElement.blur();
                this.enterKeybind.emit(e);
            }
        });
    }
}
