import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoadingIndicatorComponent} from '@common/core/ui/loading-indicator/loading-indicator.component';
import {LoadingPageComponent} from '@common/core/ui/loading-indicator/loading-page/loading-page.component';

@NgModule({
    declarations: [
        LoadingIndicatorComponent,
        LoadingPageComponent,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        LoadingIndicatorComponent,
        LoadingPageComponent,
    ]
})
export class LoadingIndicatorModule {
}
