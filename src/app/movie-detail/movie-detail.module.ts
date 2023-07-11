import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared.module';
import { MovieDetailPage } from './movie-detail.page';
import { ItemViewPageModule } from '../item-view/item-view.module';

@NgModule({
    declarations: [
        MovieDetailPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        ItemViewPageModule
    ],
    exports: [MovieDetailPage]
})
export class MovieDetailPageModule {
}
