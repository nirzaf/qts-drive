import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@common/auth/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { BackendErrorResponse } from '@common/core/types/backend-error-response';
import { AccessToken } from '@common/core/types/models/access-token';
import copy from 'copy-to-clipboard';
import { Toast } from '@common/core/ui/toast.service';

@Component({
  selector: 'create-access-token-dialog',
  templateUrl: './create-access-token-dialog.component.html',
  styleUrls: ['./create-access-token-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateAccessTokenDialogComponent {
  public form = new FormGroup({
    name: new FormControl('')
  });
  public errors$ = new BehaviorSubject({});
  public loading$ = new BehaviorSubject(false);
  public plainTextToken$ = new BehaviorSubject<string>(null);
  public token$ = new BehaviorSubject<AccessToken>(null);

  constructor(
      private auth: AuthService,
      private dialogRef: MatDialogRef<CreateAccessTokenDialogComponent>,
      private toast: Toast,
  ) { }

  public close(token?: AccessToken) {
    this.dialogRef.close(token);
  }

  public confirm() {
    this.loading$.next(true);
    this.auth.createAccessToken(this.form.value.name).subscribe(response => {
      this.loading$.next(false);
      this.plainTextToken$.next(response.plainTextToken);
      this.token$.next(response.token);
    }, (errResponse: BackendErrorResponse) => {
      this.loading$.next(false);
      this.errors$.next(errResponse.errors);
    });
  }

  public copyLinkToClipboard() {
    this.focusInput();
    const success = copy(this.plainTextToken$.value);
    if (success) {
      this.toast.open('Token copied to clipboard');
    }
  }

  public focusInput() {
    const input = document.getElementById('access-token-name') as HTMLInputElement;
    input.focus();
  }
}
