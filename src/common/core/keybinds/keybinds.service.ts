import { Injectable } from '@angular/core';
import { Keycodes } from './keycodes.enum';
import { fromEvent, Subscription } from 'rxjs';
import { DELETE } from '@angular/cdk/keycodes';

interface ParsedKeybind {
    ctrl: boolean;
    shift: boolean;
    key: string;
}

// TODO: refactor so keybinds are stored for a specific "listenOn" element instead of globally

@Injectable({
    providedIn: 'root',
})
export class Keybinds {
    private bindings = [];

    public add(keybind: string, callback: (e: KeyboardEvent) => void) {
        this.bindings.push({keybind: this.parseKeybindString(keybind), keybindString: keybind, callback});
    }

    public addWithPreventDefault(keybind: string, callback: Function) {
        this.bindings.push({keybind: this.parseKeybindString(keybind), keybindString: keybind, callback, preventDefault: true});
    }

    public listenOn(el: HTMLElement|Document): Subscription {
        return fromEvent(el, 'keydown').subscribe((e: KeyboardEvent) => {
            this.executeBindings(e);
        });
    }

    private executeBindings(e: KeyboardEvent) {
        this.bindings.forEach(binding => {
            if ( ! this.bindingMatches(binding.keybind, e)) return;
            if (binding.preventDefault && e.preventDefault) e.preventDefault();
            binding.callback(e);
        });
    }

    private bindingMatches(keybind: ParsedKeybind, e: KeyboardEvent) {
        return Keycodes[keybind.key.toUpperCase()] === e.keyCode && e.ctrlKey === keybind.ctrl && e.shiftKey === keybind.shift;
    }

    /**
     * Parse keybind string into object.
     */
    private parseKeybindString(keybind: string): ParsedKeybind {
        const parts = keybind.trim().split('+');
        const parsed = {ctrl: false, shift: false, key: ''};

        parts.forEach(part => {
            part = part.trim().toLowerCase();

            if (part === 'ctrl') {
                parsed.ctrl = true;
            } else if (part === 'shift') {
                parsed.shift = true;
            } else {
                parsed.key = part;
            }
        });

        return parsed;
    }
}
