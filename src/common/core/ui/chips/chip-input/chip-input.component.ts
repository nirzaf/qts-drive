import {
    AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, OnInit, TemplateRef, ViewChild, ViewEncapsulation
} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {MatAutocomplete} from '@angular/material/autocomplete';
import {catchError, debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Model} from '../../../types/models/model';

type ChipValue = 'string' | Model;

@Component({
    selector: 'chip-input',
    templateUrl: './chip-input.component.html',
    styleUrls: ['./chip-input.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: ChipInputComponent,
        multi: true,
    }]
})
export class ChipInputComponent implements ControlValueAccessor, OnInit, AfterViewInit {
    @Input() placeholder: string;
    @Input() type = 'text';
    @Input() emailsInput = false;
    @Input() suggestFn: (query: string) => Observable<ChipValue[]>;
    @Input() @HostBinding('class.select-mode') selectMode = false;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;
    @ViewChild('inputEl') inputEl: ElementRef<HTMLInputElement>;
    @ViewChild('selectModeTemplate') selectModeTemplate: TemplateRef<any>;

    public formControl = new FormControl();

    public propagateChange: (items: ChipValue[]) => void;
    public items$ = new BehaviorSubject<ChipValue[]>([]);
    public suggestedValues$ = new BehaviorSubject<ChipValue[]>([]);
    @Input() set suggestedValues(values: ChipValue[]) {
        this.suggestedValues$.next(values);
    }

    constructor(
        public el: ElementRef<HTMLElement>,
    ) {}

    ngOnInit() {
        if (this.suggestFn) {
            this.bindToSearchControl();
        }
        if (this.selectMode) {
           // TODO: implement
        }
    }

    ngAfterViewInit() {
        if (this.emailsInput) {
            this.parseEmailsOnPaste();
        }
    }

    public remove(index: number) {
        const items = [...this.items$.value];
        items.splice(index, 1);
        this.items$.next(items);
        this.propagateChange(this.items$.value);
    }

    public addFromChipInput(value: ChipValue, propagate = true) {
        if (value && !this.matAutocomplete.isOpen && !this.selectMode) {
            this.add(value, propagate);
        }
    }

    public addFromAutocomplete(value: ChipValue, propagate = true) {
        this.add(value, propagate);
    }

    private add(value: ChipValue, propagate = true) {
        value = (typeof value === 'string' ? value.trim() : value) as ChipValue;
        const duplicate = this.findValueIndex(value) > -1;
        if (value && !duplicate) {
            this.items$.next([...this.items$.value, value]);
            if (propagate) {
                this.propagateChange(this.items$.value);
            }
        }
        if (this.inputEl) {
            this.inputEl.nativeElement.value = '';
        }
        this.formControl.setValue(null);
        this.suggestedValues$.next([]);
    }

    private findValueIndex(value: ChipValue) {
        if (typeof value === 'string') {
            return this.items$.value.indexOf(value);
        } else {
            return this.items$.value.findIndex(v => (v as Model).id === value.id);
        }
    }

    public writeValue(value: ChipValue[] = []) {
        if (value && value.length) {
            value.forEach(item => this.add(item, false));
        } else if (this.items$.value.length) {
            while (this.items$.value.length !== 0) {
                this.remove(0);
            }
        }
    }

    public registerOnChange(fn: (items: ChipValue[]) => void) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {}

    private bindToSearchControl() {
        this.formControl.valueChanges.pipe(
            debounceTime(150),
            distinctUntilChanged(),
            switchMap(query => query ? this.suggestFn(query) : of([])),
            catchError(() => of([])),
        ).subscribe(values => {
            const filtered = values.filter(v => this.findValueIndex(v) === -1);
            this.suggestedValues$.next(filtered);
        });
    }

    public displayChipValue(value: ChipValue): string {
        return typeof value === 'object' ? value.name : value;
    }

    private parseEmailsOnPaste() {
        this.inputEl.nativeElement.addEventListener('paste', e => {
            const paste = (e.clipboardData || window['clipboardData']).getData('text');
            const emails = paste.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
            if (emails) {
                e.preventDefault();
                const selection = window.getSelection();
                if (selection.rangeCount) {
                    selection.deleteFromDocument();
                    emails.forEach(email => this.add(email));
                }
            }
        });
    }
}
