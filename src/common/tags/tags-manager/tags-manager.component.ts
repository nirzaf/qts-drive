import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {Tag} from '@common/core/types/models/Tag';
import {TagsService} from '@common/core/services/tags.service';
import {slugifyString} from '@common/core/utils/slugify-string';

@Component({
    selector: 'tags-manager',
    templateUrl: './tags-manager.component.html',
    styleUrls: ['./tags-manager.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: TagsManagerComponent,
        multi: true,
    }]
})
export class TagsManagerComponent implements OnInit, ControlValueAccessor {
    @Input() public readonly = false;
    @Input() public tagType: string;
    @Input() public pluralName = 'tags';

    public formControl = new FormControl();
    private propagateChange: (tags: string[]) => void;

    /**
     * Tags user has selected.
     */
    public selectedTags$ = new BehaviorSubject<string[]>([]);
    /**
     * A list of tags that already exist in the app.
     */
    public existingTags$ = new BehaviorSubject<Tag[]>([]);
    /**
     * Tags currently being suggested in autocomplete.
     */
    public suggestedTags$ = new BehaviorSubject<Tag[]>([]);

    constructor(private tagService: TagsService) {}

    ngOnInit() {
        this.tagService.index({perPage: 15, type: this.tagType}).subscribe(response => {
            this.existingTags$.next(response.pagination.data.filter(tag => tag.type !== 'status'));
        });
        this.formControl.valueChanges.subscribe(q => {
            const suggestions = q ?
                this.existingTags$.value.filter(t => t.name.toLowerCase().includes(q.toLowerCase())) :
                [];
            this.suggestedTags$.next(suggestions);
        });
    }

    public writeValue(value: string[]) {
        this.selectTags(value, {skipPropagate: true, override: true});
    }

    public registerOnChange(fn: (tags: string[]) => void) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {}

    public selectTags(tags?: string[], options: {skipPropagate?: boolean, override?: boolean} = {}) {
        const newTags = (tags || []).map(t => t.trim())
            .filter(t => !this.selectedTags$.value.includes(t));
        if (options.override) {
            this.selectedTags$.next(newTags);
        } else if (newTags.length) {
            this.selectedTags$.next([
                ...this.selectedTags$.value,
                ...newTags
            ]);
        }
        this.formControl.reset();
        if (!options.skipPropagate) {
           this.propagateChange(this.selectedTags$.value);
        }
    }

    public deselectTag(tagName: string) {
        const selectedTags = this.selectedTags$.value.slice();
        selectedTags.splice(selectedTags.indexOf(tagName), 1);
        this.selectedTags$.next(selectedTags);
        this.propagateChange(this.selectedTags$.value);
    }

    public selectTagsFromString(tagString: string) {
        const tags = tagString.split(',').map(t => slugifyString(t));
        this.selectTags(tags);
    }
}
