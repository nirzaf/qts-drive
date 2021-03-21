import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DriveFolder } from '../../models/driveFolder';
import { FoldersApiService } from '../../api/folders-api.service';
import { Store } from '@ngxs/store';
import { BackendErrorResponse } from '@common/core/types/backend-error-response';
import { DriveState } from '../../../state/drive-state';
import { finalize } from 'rxjs/operators';
import { NewFolderCreated } from '../../../state/actions/events';

export interface CrupdateFolderDialogData {
    folder?: DriveFolder;
}

export interface CrupdateFolderErrors {
    name?: string;
}

@Component({
    selector: 'crupdate-folder-dialog',
    templateUrl: './crupdate-folder-dialog.component.html',
    styleUrls: ['./crupdate-folder-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrupdateFolderDialogComponent {
    public folderName = new FormControl();
    public loading = new BehaviorSubject(false);
    public errors: CrupdateFolderErrors = {};

    constructor(
        private dialogRef: MatDialogRef<CrupdateFolderDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateFolderDialogData,
        private store: Store,
        private foldersApi: FoldersApiService,
        private changeDetection: ChangeDetectorRef,
    ) {}

    public confirm() {
        this.loading.next(true);

        const activeFolder = this.data.folder || this.store.selectSnapshot(DriveState.activeFolder);
        const params = {
            name: this.folderName.value,
            parentId: activeFolder?.id || null,
        };

        return this.foldersApi.create(params)
            .pipe(finalize(() => this.loading.next(false)))
            .subscribe(response => {
                this.setErrors();
                this.store.dispatch(new NewFolderCreated(response.folder));
                this.close();
            }, response => this.setErrors(response));
    }

    public setErrors(response?: BackendErrorResponse<CrupdateFolderErrors>) {
        this.errors = response ? response.errors : {};
        this.changeDetection.detectChanges();
    }

    public close() {
        this.dialogRef.close();
    }
}
