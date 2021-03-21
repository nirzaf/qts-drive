import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {OverlayPanelRef} from '@common/core/ui/overlay-panel/overlay-panel-ref';
import {GenericBackendResponse} from '@common/core/types/backend-response';
import {HttpCacheClient} from '@common/core/http/http-cache-client';

@Component({
    selector: 'icon-selector',
    templateUrl: './icon-selector.component.html',
    styleUrls: ['./icon-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconSelectorComponent implements OnInit {
    public icons$: BehaviorSubject<string[]> = new BehaviorSubject([]);
    public loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    @Output() iconSelected = new EventEmitter<string>();

    constructor(
        private http: HttpCacheClient,
        private overlayPanelRef: OverlayPanelRef,
    ) {}

    ngOnInit() {
        this.loading$.next(true);
        this.http.get<GenericBackendResponse<{icons: string[]}>>('admin/icons')
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.icons$.next(response.icons);
            });
    }

    public selectIcon(icon: string) {
        // component is used inline
        if (this.iconSelected.observers.length) {
            this.iconSelected.next(icon);
        // component is used as overlay panel
        } else {
            this.overlayPanelRef.emitValue(icon);
            this.overlayPanelRef.close();
        }

    }
}
