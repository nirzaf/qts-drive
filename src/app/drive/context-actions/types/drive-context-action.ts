export interface DriveContextAction {
    viewName: string;
    icon: string;
    execute: () => void;
    visible: () => boolean;
    separatorBefore?: boolean;
    showInCompact?: boolean;
}
