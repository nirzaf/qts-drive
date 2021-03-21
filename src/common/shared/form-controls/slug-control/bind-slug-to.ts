import {AbstractControl} from '@angular/forms';
import {distinctUntilChanged, filter} from 'rxjs/operators';
import {slugifyString} from '@common/core/utils/slugify-string';

export function bindSlugTo(control: AbstractControl) {
    control.valueChanges
        .pipe(filter(value => !!value), distinctUntilChanged())
        .subscribe(value => {
            if ( ! control.parent.get('slug').dirty) {
                control.parent.get('slug').setValue(slugifyString(value));
            }
        });
}
