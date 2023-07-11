import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { MoviesPage } from './movies.page';
import { HorizontalItemListPageModule } from '../horizontal-item-list/horizontal-item-list.module';


@NgModule({
    declarations: [
      MoviesPage
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      HorizontalItemListPageModule
    ],
    exports: [MoviesPage]
})
export class MoviesPageModule {
}
