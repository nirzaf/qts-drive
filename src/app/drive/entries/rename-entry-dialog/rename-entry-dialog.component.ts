import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { BackendErrorResponse } from '@common/core/types/backend-error-response';
import { DriveState } from '../../state/drive-state';
import { Store } from '@ngxs/store';
import { MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { Toast } from '@common/core/ui/toast.service';
import { DriveEntry } from '../../files/models/drive-entry';
import { DriveEntryApiService } from '../../drive-entry-api.service';
import { EntryRenamed } from '../../state/actions/events';

export interface RenameEntryDialogErrors {
    name?: string;
}

@Component({
    selector: 'rename-entry-dialog',
    templateUrl: './rename-entry-dialog.component.html',
    styleUrls: ['./rename-entry-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RenameEntryDialogComponent implements OnInit {
    public entryName = new FormControl();
    public loading = new BehaviorSubject(false);
    public errors: RenameEntryDialogErrors = {};
    public entry: DriveEntry;

    constructor(
        private dialogRef: MatDialogRef<RenameEntryDialogComponent>,
        private store: Store,
        private toast: Toast,
        private entriesApi: DriveEntryApiService,
        private changeDetection: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.entry = this.store.selectSnapshot(DriveState.selectedEntries)[0];
        this.entryName.setValue(this.entry.name);
    }

    public confirm() {
        const newName = this.entryName.value;

        // entry name was not changed
        if (newName === this.entry.name) {
            return this.close();
        }

        this.loading.next(true);

        return this.entriesApi.update(this.entry.id, {name: newName})
            .pipe(finalize(() => this.loading.next(false)))
            .subscribe(() => {
                this.setErrors();
                this.store.dispatch(new EntryRenamed(this.entry, newName));
                this.close();
            }, response => this.setErrors(response));
    }

    public setErrors(response?: BackendErrorResponse<RenameEntryDialogErrors>) {
        this.loading.next(false);
        this.errors = response ? response.errors : {};
        this.changeDetection.detectChanges();
    }

    public close() {
        this.dialogRef.close();
    }
}
