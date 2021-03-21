import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Pages} from '../pages.service';
import {CustomPage} from '@common/core/types/models/CustomPage';
import {Settings} from '@common/core/config/settings.service';
import {BehaviorSubject} from 'rxjs';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import {delay, filter} from 'rxjs/operators';

@Component({
    selector: 'custom-page',
    templateUrl: './custom-page.component.html',
    styleUrls: ['./custom-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomPageComponent implements OnInit {
    public page$ = new BehaviorSubject<CustomPage>(null);
    public body$ = new BehaviorSubject<SafeHtml>(null);
    @Input() showNavbar = true;
    @Input() set page(page: CustomPage) {
        this.page$.next(page);
        this.body$.next(this.sanitizer.bypassSecurityTrustHtml(page.body));
    }

    constructor(
        private pages: Pages,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private router: Router,
        public settings: Settings,
    ) {}

    ngOnInit() {
        if (this.page$.value) return;
        this.route.params.subscribe(params => {
            const id = params.id || this.route.snapshot.data.id;
            this.pages.get(id).subscribe(response => {
                this.page = response.page;
            }, () => {
                this.router.navigate(['/404'], {skipLocationChange: true});
            });
        });

        this.body$.pipe(filter(b => !!b), delay(0)).subscribe(() => {
            Prism.highlightAll();
        });
    }
}
