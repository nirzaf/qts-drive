export interface UploadInputConfig {
    types?: UploadInputTypes[];
    extensions?: string[];
    multiple?: boolean;
    directory?: boolean;
}

export enum UploadInputTypes {
    image = 'image/*',
    audio = 'audio/*',
    video = 'video/mp4,video/mpeg,video/x-m4v,video/*',
}
