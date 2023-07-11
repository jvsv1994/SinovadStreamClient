import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared.module';
import { ItemViewPageModule } from '../item-view/item-view.module';
import { TvSerieDetailPage } from './tvserie-detail.page';

@NgModule({
    declarations: [
        TvSerieDetailPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        ItemViewPageModule
    ],
    exports: [TvSerieDetailPage]
})
export class TvSerieDetailPageModule {
}
