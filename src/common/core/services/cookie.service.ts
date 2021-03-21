import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CookieService {
    public get(name: string): string|number {
        const regExp: RegExp = this.getCookieRegExp(name);
        const result: RegExpExecArray = regExp.exec(document.cookie);
        return result && result[1];
    }

    public set(name: string, value: string|number, expirationDays = 30) {
        const exdate = new Date();
        exdate.setDate(exdate.getDate() + expirationDays);
        document.cookie = `${name}=${value}; expires=${exdate.toUTCString()}; path=/;`;
    }

    private getCookieRegExp(name: string): RegExp {
        const escapedName: string = name.replace(/([\[\]\{\}\(\)\|\=\;\+\?\,\.\*\^\$])/ig, '\\$1' );
        return new RegExp( '(?:^' + escapedName + '|;\\s*' + escapedName + ')=(.*?)(?:;|$)', 'g' );
    }
}
