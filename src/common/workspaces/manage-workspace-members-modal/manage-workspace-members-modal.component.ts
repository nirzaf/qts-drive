import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FormControl} from '@angular/forms';
import {Role} from '@common/core/types/models/Role';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {WorkspacesService} from '../workspaces.service';
import {Toast} from '@common/core/ui/toast.service';
import {ValueLists} from '@common/core/services/value-lists.service';
import {Workspace} from '../types/workspace';
import {WorkspaceMember} from '../types/workspace-member';
import {WorkspaceInvite} from '../types/workspace-invite';
import {finalize} from 'rxjs/operators';
import {CurrentUser} from '@common/auth/current-user';
import {WorkspaceMessages} from '../workspace-messages';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {LEAVE_WORKSPACE_CONFIRMATION} from '../leave-workspace-confirmation';

export interface ManageWorkspaceMembersModalData {
    workspace?: Workspace;
}

type MemberOrInvite = WorkspaceMember | WorkspaceInvite;

@Component({
    selector: 'manage-workspace-members-modal',
    templateUrl: './manage-workspace-members-modal.component.html',
    styleUrls: ['./manage-workspace-members-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({opacity: 0}),
                animate('325ms ease-in', style({
                    opacity: 1,
                }))
            ])
        ]),
        trigger('fadeOut', [
            transition(':leave', [
                style({opacity: 1, position: 'absolute', left: '0', right: '0'}),
                animate('325ms ease-out', style({
                    opacity: 0
                }))
            ])
        ])
    ]
})
export class ManageWorkspaceMembersModalComponent implements OnInit {
    public inviting$ = new BehaviorSubject(false);
    public deleting$ = new BehaviorSubject(false);
    public loadingMembers$ = new BehaviorSubject(false);
    public workspaceRoles$ = new BehaviorSubject<Role[]>([]);
    public members$ = new BehaviorSubject<(WorkspaceMember|WorkspaceInvite)[]>([]);
    public peopleToInvite = new FormControl([]);

    public canInvite = false;
    public canEdit = false;
    public canDelete = false;

    constructor(
        private dialogRef: MatDialogRef<ManageWorkspaceMembersModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ManageWorkspaceMembersModalData,
        private workspaces: WorkspacesService,
        private toast: Toast,
        private valueLists: ValueLists,
        public currentUser: CurrentUser,
        private modal: Modal,
    ) {}

    ngOnInit() {
        this.loadingMembers$.next(true);
        this.valueLists.get(['workspaceRoles']).subscribe(response => {
            this.workspaceRoles$.next(response.workspaceRoles);
        });
        this.workspaces.get(this.data.workspace.id)
            .pipe(finalize(() => this.loadingMembers$.next(false)))
            .subscribe(response => {
                this.members$.next([
                    ...response.workspace.invites,
                    ...response.workspace.members
                ]);
                this.setCurrentUserPermissions();
            });
    }

    public close(workspace?: Workspace) {
        this.dialogRef.close(workspace);
    }

    public invitePeople() {
        const emails = this.peopleToInvite.value.filter(email => {
            return !this.members$.value.find(m => m.email === email);
        });
        if ( ! emails.length) {
            this.peopleToInvite.reset();
            this.toast.open('All invited people are already members.');
            return;
        }
        const payload = {
            emails,
            roleId: (this.workspaceRoles$.value.find(r => r.default) || this.workspaceRoles$.value[0]).id,
        };
        this.inviting$.next(true);
        this.workspaces.invitePeople(this.data.workspace.id, payload)
            .pipe(finalize(() => this.inviting$.next(false)))
            .subscribe(response => {
                this.members$.next([...this.members$.value, ...response.invites]);
                this.peopleToInvite.reset();
                this.toast.open(WorkspaceMessages.INVITES_SENT);
            });
    }

    public resendInvite(invite: WorkspaceInvite) {
        this.inviting$.next(true);
        this.workspaces.resendInvite(this.data.workspace.id, invite.id)
            .pipe(finalize(() => this.inviting$.next(false)))
            .subscribe(() => {
                this.toast.open(WorkspaceMessages.INVITE_RESENT);
            });
    }

    public changeRole(member: WorkspaceMember|WorkspaceInvite, role: Role) {
        this.workspaces.changeRole(this.data.workspace.id, member, role.id)
            .subscribe(() => {
                this.toast.open(WorkspaceMessages.ROLE_ASSIGNED);
                const members = [...this.members$.value];
                const i = members.findIndex(m => m.id === member.id);
                members[i].role_name = role.name;
                members[i].role_id = role.id;
                this.members$.next(members);
            });
    }

    public deleteMember(member: MemberOrInvite) {
        this.deleting$.next(true);
        const request = member.model_type === 'member' ?
            this.workspaces.deleteMember(this.data.workspace.id, member.id) :
            this.workspaces.deleteInvite(member.id);
        request
            .pipe(finalize(() => this.deleting$.next(false)))
            .subscribe(() => {
                const value = [...this.members$.value];
                const i = value.findIndex((m: MemberOrInvite) => member.id && m.model_type === member.model_type);
                value.splice(i, 1);
                this.members$.next(value);
                if (member.id === this.currentUser.get('id')) {
                    this.close();
                    this.toast.open(WorkspaceMessages.LEFT_WORKSPACE);
                } else {
                    this.toast.open(WorkspaceMessages.MEMBER_DELETED);
                }
            });
    }

    public maybeDeleteMember(member: MemberOrInvite) {
        this.modal.show(ConfirmModalComponent, {
            title: `Delete Member`,
            body:  `Are you sure you want to delete this member?`,
            bodyBold: 'All workspace resources created by this member will be transferred to workspace owner.',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.deleteMember(member);
            }
        });
    }

    public maybeResendInvite(invite: WorkspaceInvite) {
        this.modal.show(ConfirmModalComponent, {
            title: `Resend Invite`,
            body:  `Are you sure you want to send this invite again?`,
            ok:    'Resend'
        }).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.resendInvite(invite);
            }
        });
    }

    public maybeLeaveWorkspace(member: WorkspaceMember) {
        this.modal.show(ConfirmModalComponent, LEAVE_WORKSPACE_CONFIRMATION)
            .afterClosed()
            .subscribe(confirmed => {
                if (confirmed) {
                    this.deleteMember(member);
                }
            });
    }

    private setCurrentUserPermissions() {
        const member = this.members$.value.find(m => m.id === this.currentUser.get('id')) as WorkspaceMember;
        this.canInvite = member.is_owner || !!member.permissions.find(p => p.name === 'workspace_members.invite');
        this.canEdit = member.is_owner || !!member.permissions.find(p => p.name === 'workspace_members.update');
        this.canDelete = member.is_owner || !!member.permissions.find(p => p.name === 'workspace_members.delete');
    }
}
