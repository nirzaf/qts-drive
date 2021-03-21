import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Translations} from '../../translations/translations.service';
import {Settings} from '../../config/settings.service';

export interface ConfirmModalData {
    title: string;
    body: string;
    bodyBold?: string;
    ok?: string;
    cancel?: string;
    replacements?: object;
}

@Component({
    selector: 'confirm-modal',
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalComponent implements OnInit {
    constructor(
        private dialogRef: MatDialogRef<ConfirmModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmModalData,
        private i18n: Translations,
        public settings: Settings,
    ) {}

    ngOnInit() {
        if ( ! this.data.ok) {
            this.data.ok = 'Confirm';
        }
        if ( ! this.data.cancel) {
            this.data.cancel = 'Cancel';
        }
        for (const key in this.data) {
            if (typeof this.data[key] === 'string') {
                this.data[key] = this.i18n.t(this.data[key], this.data.replacements);
            }
        }
    }

    public confirm() {
        this.dialogRef.close(true);
    }

    public close() {
        this.dialogRef.close(false);
    }
}
