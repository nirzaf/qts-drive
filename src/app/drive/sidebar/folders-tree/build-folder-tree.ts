import { DriveFolder } from '../../folders/models/driveFolder';

export function buildFolderTree(folders: DriveFolder[]) {
    const hashTable = {}; const tree = [];

    for (let i = 0, len = folders.length; i < len; i++) {
        const folder = folders[i];
        // clear children from previous builds, to prevent duplicates
        folder.children = [];
        hashTable[folder.id] = folder;
    }

    for (const treeHash in hashTable) {
        if ( ! hashTable.hasOwnProperty(treeHash)) continue;
        const folder = hashTable[treeHash];
        if (folder.parent_id) {
            const parent = hashTable[folder.parent_id];
            if (parent) {
                parent.children.push(folder);
            }
        } else {
            tree.push(folder);
        }
    }

    return tree;
}
