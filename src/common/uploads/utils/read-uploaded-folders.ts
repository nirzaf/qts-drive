import { UploadedFile } from '../uploaded-file';

export async function readUploadedFolders(entries: WebKitEntry[]): Promise<UploadedFile[]> {
    let files = [];

    for (const key in entries) {
        const entry = entries[key];

        if ( ! entry.isDirectory) {
            files.push(await transformFileEntry(entry as WebKitFileEntry));
        } else {
            files = files.concat(await readDirRecursive(entry as WebKitDirectoryEntry));
        }
    }

    return files;
}

async function readDirRecursive(entry: WebKitDirectoryEntry, files = []) {
    const entries = await readEntries(entry);

    for (const key in entries) {
        const childEntry = entries[key];

        if (childEntry.isDirectory) {
            await readDirRecursive(childEntry as WebKitDirectoryEntry, files);
        } else {
            files.push(await transformFileEntry(childEntry as WebKitFileEntry));
        }
    }

    return files;
}

function readEntries(dir: WebKitDirectoryEntry): Promise<WebKitEntry[]> {
    return new Promise(resolve => {
       readEntriesRecursive(dir.createReader(), resolve);
    });
}

function readEntriesRecursive(reader: WebKitDirectoryReader, resolve, allEntries: WebKitEntry[] = []) {
    reader.readEntries(entries => {
        if (entries.length) {
            allEntries = allEntries.concat(entries);
            readEntriesRecursive(reader, resolve, allEntries);
        } else {
            resolve(allEntries);
        }
    });
}

function transformFileEntry(entry: WebKitFileEntry) {
    return new Promise(resolve => {
        entry.file((file: any) => {
            resolve(new UploadedFile(file as File, entry.fullPath));
        });
    });
}
