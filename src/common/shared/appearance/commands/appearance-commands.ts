import { AppearanceCommand } from './appearance-command';
import { CommandTypes } from './command-types';
import {Params} from '@angular/router';

export class Navigate implements AppearanceCommand {
    type = CommandTypes.Navigate;
    constructor(public route: string, public queryParams: Params) {}
}

export class SetConfig implements AppearanceCommand {
    type = CommandTypes.SetConfig;
    constructor(public key: string, public value: string|number) {}
}

export class Select implements AppearanceCommand {
    type = CommandTypes.Select;
    constructor(public selector: string, public index = 0) {}
}

export class Deselect implements AppearanceCommand {
    type = CommandTypes.Deselect;
}

export class SetColors implements AppearanceCommand {
    type = CommandTypes.SetColors;
    constructor(public key: string, public value: string) {}
}

export class SetCustomCss implements AppearanceCommand {
    type = CommandTypes.SetCustomCss;
    constructor(public content: string) {}
}

export class SetCustomHtml implements AppearanceCommand {
    type = CommandTypes.SetCustomHtml;
    constructor(public content: string) {}
}

export type AllCommands = Navigate | SetConfig | Select;
