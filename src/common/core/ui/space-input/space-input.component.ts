import {ChangeDetectionStrategy, Component, HostBinding, Input, OnInit} from '@angular/core';
import {randomString} from '../../utils/random-string';
import {spaceUnits} from '../../utils/space-units';
import {ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {map} from 'rxjs/operators';
import {convertToBytes} from '../../utils/convertToBytes';
import {prettyBytes} from '../../utils/pretty-bytes';

@Component({
    selector: 'space-input',
    templateUrl: './space-input.component.html',
    styleUrls: ['./space-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: SpaceInputComponent,
        multi: true,
    }]
})
export class SpaceInputComponent implements ControlValueAccessor, OnInit {
    @HostBinding('class.input-container') inputContainer = true;
    @Input() label: string;
    @Input() name: string;

    public id = randomString();
    public spaceUnits = spaceUnits;
    public form = new FormGroup({
        unit: new FormControl('MB'),
        amount: new FormControl(null)
    });

    public propagateChange: Function;

    ngOnInit() {
        this.form.valueChanges
            .pipe(map(model => convertToBytes(model.amount, model.unit)))
            .subscribe(value => this.propagateChange(value));
    }

    public writeValue(value: number) {
        this.form.setValue(this.fromBytes(value), {emitEvent: false});
    }

    public registerOnChange(fn: Function) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {}

    private fromBytes(bytes: number) {
        const pretty = prettyBytes(bytes);
        if ( ! pretty) return {amount: null, unit: 'MB'};
        return {amount: pretty.split(' ')[0], unit: pretty.split(' ')[1]};
    }
}
