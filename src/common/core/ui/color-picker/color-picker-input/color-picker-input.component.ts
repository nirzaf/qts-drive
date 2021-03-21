import {ChangeDetectionStrategy, Component, ElementRef, OnDestroy} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BOTTOM_POSITION} from '@common/core/ui/overlay-panel/positions/bottom-position';
import {OverlayPanel} from '@common/core/ui/overlay-panel/overlay-panel.service';
import {BehaviorSubject, Subscription} from 'rxjs';

@Component({
    selector: 'color-picker-input',
    templateUrl: './color-picker-input.component.html',
    styleUrls: ['./color-picker-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: ColorPickerInputComponent,
        multi: true,
    }]
})
export class ColorPickerInputComponent implements OnDestroy, ControlValueAccessor {
    private pickerSub: Subscription;
    public propagateChange: Function;
    public color$ = new BehaviorSubject(null);

    constructor(
        private overlayPanel: OverlayPanel,
    ) {}

    public ngOnDestroy(): void {
        this.pickerSub && this.pickerSub.unsubscribe();
    }

    public writeValue(value: string) {
        this.color$.next(value);
    }

    public registerOnChange(fn: Function) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {}

    public async openColorPicker(e: MouseEvent) {
        const { BeColorPickerModule } = await import('@common/core/ui/color-picker/be-color-picker.module');
        this.pickerSub = this.overlayPanel.open(
            BeColorPickerModule.components.panel,
            {
                origin: new ElementRef(e.target),
                position: BOTTOM_POSITION,
                data: {color: this.color$.value}
            }
        ).valueChanged().subscribe(color => {
            this.color$.next(color);
            this.propagateChange(this.color$.value);
        });
    }
}
