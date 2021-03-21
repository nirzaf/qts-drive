import { Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { CreateShareableLink, ShareLinkState, ToggleOptionsPanel, UpdateShareableLink } from '../share-link.state';
import { Observable } from 'rxjs';
import { ShareableLink } from '../models/shareable-link';
import { filter } from 'rxjs/operators';
import { ShareableLinkOptions } from '../models/shareable-link-options';
import { BackendErrorMessages } from '@common/core/types/backend-error-response';

@Component({
    selector: 'link-options',
    templateUrl: './link-options.component.html',
    styleUrls: ['./link-options.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkOptionsComponent implements OnInit {
    @Select(ShareLinkState.link) link$: Observable<ShareableLink>;
    @Select(ShareLinkState.loading) loading$: Observable<boolean>;
    @Select(ShareLinkState.backendErrors) backendErrors$: Observable<BackendErrorMessages>;

    public form = new FormGroup({
        password: new FormControl(),
        expiresAt: new FormGroup({
            date: new FormControl(),
            time: new FormControl(),
        }),
        allowEdit: new FormControl(false),
        allowDownload: new FormControl(true)
    });

    public passwordVisible = new FormControl(false);
    public expirationVisible = new FormControl(false);

    constructor(private store: Store) {}

    ngOnInit() {
        this.bindToLinkChange();
    }

    public toggleOptionsPanel() {
        this.store.dispatch(new ToggleOptionsPanel());
    }

    public saveChanges() {
        if (this.store.selectSnapshot(ShareLinkState.link)) {
            this.store.dispatch(new UpdateShareableLink(this.getPayload()));
        } else {
            this.store.dispatch(new CreateShareableLink(this.getPayload()));
        }
    }

    private getPayload() {
        const payload = {
            allowEdit: this.form.get('allowEdit').value,
            allowDownload: this.form.get('allowDownload').value,
        } as ShareableLinkOptions;

        if (this.expirationVisible.value) {
            payload.expiresAt = this.form.get('expiresAt.date').value;
            if (this.form.get('expiresAt.time').value) {
                payload.expiresAt += ' ' + this.form.get('expiresAt.time').value;
            }
        }

        // not sending "password" with request will remove it from link
        if (this.passwordVisible.value) {
            payload.password = this.form.get('password').value;
        }

        return payload;
    }

    private bindToLinkChange() {
        this.link$.pipe(filter(link => !!link))
            .subscribe(link => {
                this.hydrateExpirationForm(link);

                // show or hide password form field
                this.passwordVisible.setValue(!!link.password);
                this.expirationVisible.setValue(!!link.expires_at);

                this.form.patchValue({
                    allowEdit: link.allow_edit,
                    allowDownload: link.allow_download
                });
            });
    }

    private hydrateExpirationForm(link: ShareableLink) {
        if ( ! link || ! link.expires_at) return;

        const parts = link.expires_at.split(' ');

        this.form.get('expiresAt').setValue({
            date: parts[0],
            time: parts[1]
        });
    }

    public getMinDate(): string {
        return new Date().toJSON().split('T')[0];
    }
}
