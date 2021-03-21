import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ShareableLinksApiService } from '../../../sharing/links/shareable-links-api.service';
import { ShareableLink } from '../../../sharing/links/models/shareable-link';

@Component({
    selector: 'link-preview-password-panel',
    templateUrl: './link-preview-password-panel.component.html',
    styleUrls: ['./link-preview-password-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkPreviewPasswordPanelComponent {
    public passwordControl = new FormControl();
    public passwordError$ = new BehaviorSubject(false);

    @Input() link: ShareableLink;
    @Output() passwordValid = new EventEmitter(null);

    constructor(private links: ShareableLinksApiService) {}

    public submitPassword() {
        this.links.checkPassword(this.link.id, this.passwordControl.value)
            .subscribe(response => {
               this.handlePasswordCheck(response.matches);
            }, () => {});
    }

    private handlePasswordCheck(matches: boolean) {
        this.passwordError$.next(!matches);

        if (matches) {
            this.passwordValid.emit(this.passwordControl.value);
        }
    }
}
