import { DriveEntry } from '../../files/models/drive-entry';

export interface DriveFolder extends DriveEntry {
    type: 'folder';
    model_type?: string;
    children: DriveFolder[];
}
