import {ConfirmModalData} from '@common/core/ui/confirm-modal/confirm-modal.component';

export const LEAVE_WORKSPACE_CONFIRMATION: ConfirmModalData = {
    title: `Leave Workspace`,
    body:  `Are you sure you want to leave this workspace?`,
    bodyBold: `All resources you've created in the workspace will be transferred to workspace owner.`,
    ok: 'Leave'
};
