import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VideoPageModule } from '../video/video.module';
import { VerticalItemListPage } from './vertical-item-list.page';
import { SharedModule } from 'src/shared.module';

@NgModule({
    declarations: [
        VerticalItemListPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        VideoPageModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [VerticalItemListPage]
})
export class VerticalItemListPageModule {
}
