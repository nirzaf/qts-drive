import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
    selector: 'datetime-input',
    templateUrl: './datetime-input.component.html',
    styleUrls: ['./datetime-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: DatetimeInputComponent,
        multi: true,
    }]
})
export class DatetimeInputComponent implements ControlValueAccessor {
    @Input() id: string;
    @Input() currentDateAsDefault = false;

    public currentDate: string;
    public currentTime: string;
    private initiated = false;

    private propagateChange: Function;
    public form = this.fb.group({
        date: [''],
        time: [''],
    });

    constructor(private fb: FormBuilder) {
        this.setCurrentDatetime();
    }

    public writeValue(value: string) {
        let [date, time] = (value || '').split(' ');

        if ( ! this.initiated && this.currentDateAsDefault) {
            date = date || this.currentDate;
            time = time || this.currentTime;
        }

        this.initiated = true;
        this.form.patchValue({date, time});
    }

    public registerOnChange(fn: Function) {
        this.propagateChange = fn;
        this.form.valueChanges.subscribe(value => {
            if ( ! value.time) {
                value.time = '00:00';
            }
            let datetime = `${value.date} ${value.time}`;
            // add seconds, if don't already exist
            if (datetime.split(':').length === 2) {
               datetime += ':00';
            }
            this.propagateChange(datetime);
        });
    }

    public registerOnTouched() {}

    private setCurrentDatetime() {
        const [date, time] = (new Date).toISOString().replace('Z', '').split('T');
        const [hours, minutes] = time.split(':');
        this.currentDate = date;
        this.currentTime = `${hours}:${minutes}`;
    }
}
