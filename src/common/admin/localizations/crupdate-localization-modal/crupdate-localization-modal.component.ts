import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BehaviorSubject, Observable} from 'rxjs';
import {Localization} from '@common/core/types/models/Localization';
import {Localizations} from '@common/core/translations/localizations.service';
import {LocalizationWithLines} from '@common/core/types/localization-with-lines';
import {Role} from '@common/core/types/models/Role';
import {FormBuilder} from '@angular/forms';
import {finalize} from 'rxjs/operators';
import {Toast} from '@common/core/ui/toast.service';
import {LanguageListItem, ValueLists} from '@common/core/services/value-lists.service';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';

export interface CrupdateLocalizationModalData {
    localization?: LocalizationWithLines;
}

@Component({
    selector: 'crupdate-localization-modal',
    templateUrl: './crupdate-localization-modal.component.html',
    styleUrls: ['./crupdate-localization-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrupdateLocalizationModalComponent implements OnInit {
    public loading$ = new BehaviorSubject<boolean>(false);
    public errors$ = new BehaviorSubject<Partial<Role>>({});
    public languages$ = new BehaviorSubject<LanguageListItem[]>([]);
    public form = this.fb.group({
        name: [''],
        language: [''],
    });

    constructor(
        private fb: FormBuilder,
        private localizations: Localizations,
        private dialogRef: MatDialogRef<CrupdateLocalizationModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateLocalizationModalData,
        private toast: Toast,
        private lists: ValueLists,
    ) {}

    ngOnInit() {
        this.lists.get(['languages']).subscribe(response => {
            this.languages$.next(response.languages);
        });
        if (this.data.localization) {
            this.form.patchValue(this.data.localization.model);
        }
    }

    public confirm() {
        this.loading$.next(true);
        const request = this.data.localization
            ? this.updateLocalization() :
            this.createNewLocalization();
        request
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.close(response.localization);
                this.toast.open('Localization ' + (this.data.localization ? 'updated' : 'created'));
            }, (errResponse: BackendErrorResponse) => this.errors$.next(errResponse.errors));
    }

    public close(localization?: LocalizationWithLines) {
        this.dialogRef.close(localization);
    }

    public createNewLocalization(): Observable<{localization: LocalizationWithLines}> {
        return this.localizations.create(this.form.value);
    }

    public updateLocalization(): Observable<{localization: LocalizationWithLines}> {
        return this.localizations.update(this.data.localization.model.id, this.form.value);
    }
}
