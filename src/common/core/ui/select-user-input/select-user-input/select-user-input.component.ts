import {ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {catchError, debounceTime, distinctUntilChanged, finalize, switchMap} from 'rxjs/operators';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {User} from '@common/core/types/models/User';
import {Users} from '@common/auth/users.service';

@Component({
    selector: 'select-user-input',
    templateUrl: './select-user-input.component.html',
    styleUrls: ['./select-user-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: SelectUserInputComponent,
        multi: true,
    }]
})
export class SelectUserInputComponent implements ControlValueAccessor, OnInit {
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef<HTMLInputElement>;
    public searchFormControl = new FormControl();
    public loading$ = new BehaviorSubject(false);
    public users$ = new BehaviorSubject<User[]>([]);
    public selectedUser$ = new BehaviorSubject<User>(null);
    private propagateChange: Function;
    public searchedOnce = false;

    constructor(private users: Users) {}

    ngOnInit() {
        this.bindToSearchControl();
    }

    public writeValue(value: User) {
        if (typeof value === 'object') {
            this.selectedUser$.next(value);
        }
    }

    public registerOnChange(fn: Function) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {}

    private bindToSearchControl() {
        this.searchFormControl.valueChanges.pipe(
            debounceTime(150),
            distinctUntilChanged(),
            switchMap(query => this.searchUsers(query)),
            catchError(() => of([])),
        ).subscribe(users => {
            this.searchedOnce = true;
            this.users$.next(users);
        });
    }

    private searchUsers(query: string): Observable<User[]> {
        this.loading$.next(true);
        return this.users.getAll({query, perPage: 7})
            .pipe(finalize(() =>  this.loading$.next(false)));
    }

    public onMenuOpened() {
        if (!this.searchedOnce) {
            this.clearSearchInput();
        }
        setTimeout(() => {
            this.searchInput.nativeElement.focus();
        });
    }

    public selectUser(user: User) {
        this.selectedUser$.next(user);
        this.propagateChange(user);
    }

    public clearSearchInput() {
        this.searchFormControl.setValue('');
    }

    public onMenuClosed() {
        this.loading$.next(false);
        this.clearSearchInput();
    }
}
