import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IconSelectorComponent} from '@common/shared/icon-selector/icon-selector.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {LoadingIndicatorModule} from '@common/core/ui/loading-indicator/loading-indicator.module';


@NgModule({
    declarations: [
        IconSelectorComponent,
    ],
    imports: [
        CommonModule,
        LoadingIndicatorModule,

        MatButtonModule,
        MatIconModule,
    ],
    exports: [
        IconSelectorComponent,
    ]
})
export class IconSelectorModule {
}
