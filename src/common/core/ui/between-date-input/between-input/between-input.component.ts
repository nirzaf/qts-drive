import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR} from '@angular/forms';
import {filter} from 'rxjs/operators';

@Component({
    selector: 'between-input',
    templateUrl: './between-input.component.html',
    styleUrls: ['./between-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: BetweenInputComponent,
        multi: true,
    }]
})
export class BetweenInputComponent implements ControlValueAccessor {
    @Input() setDefaultDate = false;
    @Input() showLabels = false;
    public datePattern = '([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))';
    private initiated = false;
    public defaultFrom: string;
    public defaultTo: string;
    private propagateChange: Function;
    public form = this.fb.group({
        from: [''],
        to: [''],
    });

    constructor(public fb: FormBuilder) {
        this.defaultFrom = this.getDefaultDate(7);
        this.defaultTo = this.getDefaultDate();
    }

    public writeValue(value: string|string[]) {
        if ( ! Array.isArray(value)) {
            value =  (value || '').split(':');
        }
        let [from, to] = value;

        if ( ! this.initiated && this.setDefaultDate) {
            from = from || this.defaultFrom;
            to = to || this.defaultTo;
        }

        this.initiated = true;
        this.form.patchValue({from, to});
    }

    public registerOnChange(fn: Function) {
        this.propagateChange = fn;
        this.form.valueChanges
            // only emit if user has set values to both to and from inputs
            .pipe(filter(value => value.from && value.to))
            .subscribe(value => {
                const between = `${value.from}:${value.to}`;
                this.propagateChange(between);
            });
    }

    public registerOnTouched() {}

    private getDefaultDate(minusDays: number = 0) {
        const d = new Date();
        d.setDate(d.getDate() - minusDays);
        const month = this.addZero(d.getMonth() + 1),
            day = this.addZero(d.getDate());
        return `${d.getFullYear()}-${month}-${day}`;
    }

    private addZero(number: number): string {
        return number < 10 ? '0' + number : '' + number;
    }
}
