import {
    ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit
} from '@angular/core';
import { DriveEntry } from '../../models/drive-entry';
import { Store } from '@ngxs/store';
import { ReloadPageEntries } from '../../../state/actions/commands';
import { DatatableService } from '@common/datatable/datatable.service';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'files-list',
    templateUrl: './files-list.component.html',
    styleUrls: ['./files-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DatatableService],
})
export class FilesListComponent implements OnInit, OnDestroy {
    @Input() entries: DriveEntry[];
    @Input() disableInteractions = false;

    constructor(private store: Store, private datatable: DatatableService<DriveEntry>) {}

    ngOnInit() {
        this.datatable.init({
            disableSort: this.disableInteractions,
        });

        this.datatable.sort$
            .pipe(filter(v => !!Object.keys(v).length))
            .subscribe(value => {
                this.store.dispatch(new ReloadPageEntries(value as any));
            });
    }

    ngOnDestroy() {
        this.datatable.destroy();
    }

    public isStarred(entry: DriveEntry): boolean {
        if ( ! entry.tags) return false;
        return !!entry.tags.find(tag => tag.name === 'starred');
    }

    public trackById(index: number, entry: DriveEntry): number {
        return entry.id;
    }
}
