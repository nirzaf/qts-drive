import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SettingsPanelComponent} from '../settings-panel.component';
import {finalize} from 'rxjs/operators';

@Component({
    selector: 'cache-settings',
    templateUrl: './cache-settings.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'settings-panel'},
})
export class CacheSettingsComponent extends SettingsPanelComponent {
    public clearCache() {
        this.loading$.next(true);
        this.http.post('cache/flush')
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(() => {
                this.toast.open('Cache cleared.');
            });
    }
}
