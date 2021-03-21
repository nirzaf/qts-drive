import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';

interface SelectTagsModalComponentData {
    tagType?: string;
    pluralName?: string;
}

@Component({
    selector: 'tag-manager-modal',
    templateUrl: './select-tags-modal.component.html',
    styleUrls: ['./select-tags-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectTagsModalComponent {
    public selectedTagsControl = new FormControl();
    public pluralName: string;

    constructor(
        private dialogRef: MatDialogRef<SelectTagsModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SelectTagsModalComponentData,
    ) {
        this.pluralName = this.data.pluralName || 'tags';
    }

    public close() {
        this.dialogRef.close();
    }

    public confirm() {
        this.dialogRef.close(this.selectedTagsControl.value);
    }

    public noTagsSelected(): boolean {
        return !this.selectedTagsControl.value?.length;
    }
}
