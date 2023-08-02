import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ItemListPageModule } from '../item-list/item-list.module';
import { MovieListPage } from './movie-list.page';


@NgModule({
    declarations: [
      MovieListPage
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      ItemListPageModule
    ],
    exports: [MovieListPage]
})
export class MovieListPageModule {
}
