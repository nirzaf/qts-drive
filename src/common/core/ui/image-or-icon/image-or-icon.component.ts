import {ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit} from '@angular/core';
import {Settings} from '../../config/settings.service';
import {BehaviorSubject} from 'rxjs';
import {isAbsoluteUrl} from '@common/core/utils/is-absolute-url';

@Component({
    selector: 'image-or-icon',
    templateUrl: './image-or-icon.component.html',
    styleUrls: ['./image-or-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageOrIconComponent implements OnChanges, OnInit {
    @Input() src: string;
    @Input() alt = '';
    @Input() className = '';

    public type$ = new BehaviorSubject<'absolute'|'relative'|'icon'>(null);

    constructor(public settings: Settings, private el: ElementRef<HTMLElement>) {}

    ngOnInit() {
        this.type$.subscribe(type => {
            this.el.nativeElement.classList.remove('image');
            this.el.nativeElement.classList.remove('icon');
            if (type === 'absolute' || type === 'relative') {
                this.el.nativeElement.classList.add('image');
            } else {
                this.el.nativeElement.classList.add('icon');
            }
        });
    }

    ngOnChanges() {
        if ( ! this.src) return;
        if (isAbsoluteUrl(this.src)) {
            this.type$.next('absolute');
        } else if (this.src.indexOf('.') > -1) {
            this.type$.next('relative');
        } else {
            this.type$.next('icon');
        }
    }
}
