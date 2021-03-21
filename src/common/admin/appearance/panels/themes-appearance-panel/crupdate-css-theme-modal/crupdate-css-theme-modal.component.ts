import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Toast} from '@common/core/ui/toast.service';
import {CssTheme} from '@common/core/types/models/CssTheme';
import {CssThemeService} from '@common/admin/appearance/panels/themes-appearance-panel/css-theme.service';
import {filter} from 'rxjs/operators';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';

interface CrupdateCssThemeModalData {
    theme: CssTheme;
}

@Component({
    selector: 'crupdate-css-theme-modal',
    templateUrl: './crupdate-css-theme-modal.component.html',
    styleUrls: ['./crupdate-css-theme-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrupdateCssThemeModalComponent {
    public loading$ = new BehaviorSubject(false);
    public errors$ = new BehaviorSubject<{[K in keyof Partial<CssTheme>]: string}>({});
    public form = this.fb.group({
        name: [''],
        is_dark: [false],
        default_dark: [false],
        default_light: [false],
    });

    constructor(
        private dialogRef: MatDialogRef<CrupdateCssThemeModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateCssThemeModalData,
        private cssTheme: CssThemeService,
        private toast: Toast,
        private fb: FormBuilder,
    ) {
        if (data.theme) {
            this.form.patchValue(data.theme);
        }

        // make sure "default_light" and "default_dark"
        // can't be toggled on at the same time
        this.form.get('default_dark')
            .valueChanges
            .pipe(filter(value => !!value))
            .subscribe(() => {
                this.form.get('default_light').setValue(false);
            });
        this.form.get('default_light')
            .valueChanges
            .pipe(filter(value => !!value))
            .subscribe(() => {
                this.form.get('default_dark').setValue(false);
            });
    }

    public confirm() {
        const request = this.data.theme ?
            this.cssTheme.update(this.data.theme.id, this.form.value) :
            this.cssTheme.create(this.form.value);
        request.subscribe(response => {
            this.toast.open(this.data.theme ? 'Theme updated' : 'Theme created');
            this.close(response.theme);
        }, (errResponse: BackendErrorResponse) => this.errors$.next(errResponse.errors));
    }

    public close(theme?: CssTheme) {
        this.dialogRef.close(theme);
    }
}
