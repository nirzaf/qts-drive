import {Component, Inject} from '@angular/core';
import {Toast} from '@common/core/ui/toast.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Tag} from '@common/core/types/models/Tag';
import {TagsService} from '@common/core/services/tags.service';
import {FormControl, FormGroup} from '@angular/forms';
import {Settings} from '@common/core/config/settings.service';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';

interface CrupdateTagModalData {
   tag?: Tag;
   forceType?: string;
}

interface CrupdateTagModalErrors {
    name?: string;
    display_name?: string;
    type?: string;
}

@Component({
    selector: 'crupdate-tag-modal',
    templateUrl: './crupdate-tag-modal.component.html',
    styleUrls: ['./crupdate-tag-modal.component.scss'],
})
export class CrupdateTagModalComponent {
    public errors: CrupdateTagModalErrors = {};
    public tagTypes: {name: string, system?: boolean}[];
    public isSystemTag = false;

    public form = new FormGroup({
        name: new FormControl(''),
        display_name: new FormControl(''),
        type: new FormControl(''),
    });

    constructor(
        private dialogRef: MatDialogRef<CrupdateTagModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateTagModalData,
        private toast: Toast,
        private tags: TagsService,
        private settings: Settings,
    ) {
        this.hydrate();
    }

    public close(tag?: Tag) {
        this.errors = {};
        this.dialogRef.close(tag);
    }

    private hydrate() {
        this.tagTypes = this.settings.get('vebto.admin.tagTypes', []);

        if (this.data.tag) {
            this.form.patchValue(this.data.tag);
        } else {
            this.form.get('type').patchValue(this.data.forceType || this.tagTypes[0]?.name || '');
        }

        const type = this.data.forceType || this.data.tag?.type;
        this.isSystemTag = this.tagTypes.find(t => t.name === type)?.system;
        if (this.isSystemTag || this.data.forceType) {
            this.form.get('type').disable();
        }
        if (this.isSystemTag) {
            this.form.get('name').disable();
        }
    }

    public confirm() {
        const request = this.data.tag ?
            this.tags.update(this.data.tag.id, this.form.getRawValue()) :
            this.tags.create(this.form.getRawValue());
        request.subscribe(response => {
            this.toast.open('Tag ' + (this.data.tag ? 'Updated' : 'Created'));
            this.close(response.tag);
        }, (errResponse: BackendErrorResponse) => this.errors = errResponse.errors);
    }
}
