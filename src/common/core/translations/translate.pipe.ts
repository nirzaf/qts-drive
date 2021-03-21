import { Pipe, PipeTransform } from '@angular/core';
import { Translations } from './translations.service';

@Pipe({
    name: 'trans',
    pure: true,
})
export class TransPipe implements PipeTransform {
    constructor(private i18n: Translations) {}

    transform(value: string, values?: object): string {
        return this.i18n.t(value, values);
    }
}
