import {ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import {Router} from '@angular/router';

@Component({
    selector: 'pagination-widget',
    templateUrl: './pagination-widget.component.html',
    styleUrls: ['./pagination-widget.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationWidgetComponent {
    private numberOfPages: number;
    public iterator: number[];
    public currentPage: number;

    @HostBinding('class.hidden') get shouldHide() {
        return this.numberOfPages < 2;
    }

    @Output() pageChanged = new EventEmitter<number>();

    @Input() disabled = true;
    @Input() set pagination(value: PaginationResponse<any>) {
        if (value) {
            this.numberOfPages = value.last_page > 10 ? 10 : value.last_page;
            if (this.numberOfPages > 1) {
                this.iterator = Array.from(Array(this.numberOfPages).keys()).map(n => n + 1);
                this.currentPage = value.current_page;
            }
        }
    }

    constructor(private router: Router) {}

    public selectPage(page: number) {
        if (this.currentPage !== page) {
            this.currentPage = page;
            this.pageChanged.next(page);
            this.router.navigate([], {queryParams: {page}, replaceUrl: true});
        }
    }

    public nextPage() {
        const newPage = this.currentPage + 1;
        this.selectPage(newPage <= this.numberOfPages ? newPage : this.currentPage);
    }

    public prevPage() {
        const newPage = this.currentPage - 1;
        this.selectPage(newPage >= 1 ? newPage : this.currentPage);
    }
}
