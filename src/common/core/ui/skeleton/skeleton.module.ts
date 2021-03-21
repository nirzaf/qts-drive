import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SkeletonComponent} from './skeleton.component';

@NgModule({
    declarations: [
        SkeletonComponent,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        SkeletonComponent,
    ]
})
export class SkeletonModule {
}
