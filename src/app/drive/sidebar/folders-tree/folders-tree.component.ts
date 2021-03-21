import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation
} from '@angular/core';
import { FoldersTreeService } from './folders-tree.service';
import { DriveFolder } from '../../folders/models/driveFolder';
import { Store } from '@ngxs/store';
import { DriveState } from '../../state/drive-state';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'folders-tree',
    templateUrl: './folders-tree.component.html',
    styleUrls: ['./folders-tree.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FoldersTreeService],
})
export class FoldersTreeComponent implements OnInit, OnDestroy {
    @HostBinding('class.expanded') @Input() expanded = false;
    @HostBinding('class.has-root-node') @Input() showRootNode = false;
    @Input() disableContextMenu = false;
    @Output() folderSelected: EventEmitter<DriveFolder> = new EventEmitter();

    // TODO: start trackBy function when it's fixed on angular material side
    private subscriptions: Subscription[] = [];
    public selectedFolderId$ = new BehaviorSubject<string>(null);
    constructor(public tree: FoldersTreeService, private store: Store) {}

    public selectFolder(folder?: DriveFolder) {
        this.selectedFolderId$.next(folder?.hash);
        this.folderSelected.emit(folder);
    }

    public toggle() {
        this.expanded = !this.expanded;
    }

    ngOnInit() {
        const sub1 = this.store.select(DriveState.userFolders)
            .pipe(filter(fs => !!fs))
            .subscribe(folders => {
                this.tree.data = folders;
            });

        const sub2 = this.store.select(DriveState.activePage).subscribe(page => {
            this.selectedFolderId$.next(page.folderHash);
        });

        this.subscriptions.push(sub1, sub2);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
