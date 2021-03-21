import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdHostComponent} from '@common/core/ui/ad-host/ad-host.component';


@NgModule({
    declarations: [
        AdHostComponent,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        AdHostComponent,
    ]
})
export class AdHostModule {
}
