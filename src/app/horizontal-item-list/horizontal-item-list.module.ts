import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HorizontalItemListPage } from './horizontal-item-list.page';
import { VideoPageModule } from '../video/video.module';
import { SharedModule } from '../shared/shared.module';
@NgModule({
    declarations: [
        HorizontalItemListPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        VideoPageModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [HorizontalItemListPage]
})
export class HorizontalItemListPageModule {
}
