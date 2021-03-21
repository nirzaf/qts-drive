import {Localization} from './models/Localization';

export interface LocalizationWithLines {
    model: Localization;
    name: string;
    lines?: {[key: string]: string};
}
