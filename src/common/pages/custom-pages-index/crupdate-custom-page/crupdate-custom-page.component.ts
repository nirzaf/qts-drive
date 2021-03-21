import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {delay, finalize} from 'rxjs/operators';
import {TextEditorComponent} from '../../../text-editor/text-editor.component';
import {CustomPage} from '../../../core/types/models/CustomPage';
import {Pages} from '../../shared/pages.service';
import {Toast} from '../../../core/ui/toast.service';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {bindSlugTo} from '../../../shared/form-controls/slug-control/bind-slug-to';
import {BackendErrorResponse} from '../../../core/types/backend-error-response';

@Component({
    selector: 'crupdate-page',
    templateUrl: './crupdate-custom-page.component.html',
    styleUrls: ['./crupdate-custom-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrupdateCustomPageComponent implements OnInit {
    @ViewChild(TextEditorComponent) textEditor: TextEditorComponent;
    public hideSlug: boolean = this.route.snapshot.data.hideSlug;
    public endpoint: string = this.route.snapshot.data.endpoint;
    public loading$ = new BehaviorSubject<boolean>(false);
    public updating$ = new BehaviorSubject<boolean>(false);
    public page: CustomPage;
    public form = this.fb.group({
        title: [''],
        slug: [''],
        body: [''],
        type: [''],
        hide_nav: [false],
    });
    public errors$ = new BehaviorSubject<{
        body?: string,
        slug?: string,
        title?: string,
    }>({});

    constructor(
        private pages: Pages,
        private route: ActivatedRoute,
        private toast: Toast,
        private router: Router,
        private fb: FormBuilder,
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.getPage(params.id);
        });

        if ( ! this.route.snapshot.data.hideSlug) {
            bindSlugTo(this.form.get('title'));
        }
    }

    public crupdatePage() {
        this.loading$.next(true);
        const request = this.updating$.value ?
            this.pages.update(this.page.id, this.getPayload(), this.endpoint) :
            this.pages.create(this.getPayload(), this.endpoint);

        request.pipe(finalize(() => this.loading$.next(false)))
            .subscribe(() => {
                this.router.navigate(this.backRoute(), {relativeTo: this.route});
                this.toast.open(this.updating$.value ? 'Page updated' : 'Page created');
            }, (errResponse: BackendErrorResponse) => this.errors$.next(errResponse.errors));
    }

    public getPage(id: number) {
        if ( ! id) return;
        this.loading$.next(true);
        this.pages.get(id).pipe(delay(0)).subscribe(response => {
            this.updating$.next(true);
            this.page = response.page;
            this.form.patchValue(response.page);
            this.textEditor.setContents(response.page.body || '');
            this.loading$.next(false);
        });
    }

    private getPayload(): CustomPage {
        return {...this.form.value};
    }

    public setBody(content: string) {
        this.form.patchValue({body: content});
    }

    public backRoute() {
        return this.page ? ['../../'] : ['../'];
    }

    public slugPrefix() {
        return 'pages/' + (this.page ? this.page.id : '*');
    }
}
