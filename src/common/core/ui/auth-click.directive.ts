import {Directive, EventEmitter, HostListener, Output} from '@angular/core';
import {CurrentUser} from '../../auth/current-user';
import {Router} from '@angular/router';

@Directive({
    selector: '[authClick]'
})
export class AuthClickDirective {
    @Output() authClick = new EventEmitter();

    constructor(
        private currentUser: CurrentUser,
        private router: Router,
    ) {}

    @HostListener('click', ['$event'])
    public click(e: MouseEvent) {
        if ( ! this.currentUser.isLoggedIn()) {
            this.currentUser.redirectUri = this.router.url;
            return this.router.navigate(['/login']);
        }

        e.preventDefault();
        e.stopPropagation();
        this.authClick.next(e);
    }
}
