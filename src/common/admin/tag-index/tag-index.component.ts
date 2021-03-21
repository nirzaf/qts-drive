import {Component, OnInit} from '@angular/core';
import {CrupdateTagModalComponent} from './crupdate-tag-modal/crupdate-tag-modal.component';
import {Tag} from '@common/core/types/models/Tag';
import {TagsService} from '@common/core/services/tags.service';
import {CurrentUser} from '@common/auth/current-user';
import {DatatableService} from '../../datatable/datatable.service';
import {Observable} from 'rxjs';
import {Settings} from '../../core/config/settings.service';

@Component({
    selector: 'tags',
    templateUrl: './tag-index.component.html',
    providers: [DatatableService],
})
export class TagIndexComponent implements OnInit {
    public tags$ = this.datatable.data$ as Observable<Tag[]>;
    public showFilterPanel: boolean;

    constructor(
        private tags: TagsService,
        public currentUser: CurrentUser,
        public datatable: DatatableService<Tag>,
        public settings: Settings,
    ) { }

    ngOnInit() {
        this.showFilterPanel = this.settings.get('vebto.admin.tagTypes')?.length > 1;
        this.datatable.init({
            uri: TagsService.BASE_URI,
        });
    }

    public maybeDeleteSelectedTags() {
        this.datatable.confirmResourceDeletion('tags')
            .subscribe(() => {
                this.tags.delete(this.datatable.selectedRows$.value).subscribe(() => {
                    this.datatable.reset();
                });
            });
    }

    public showCrupdateTagModal(tag?: Tag) {
        this.datatable.openCrupdateResourceModal(CrupdateTagModalComponent, {tag})
          .subscribe();
    }
}
