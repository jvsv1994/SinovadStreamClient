import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HorizontalItemListPageModule } from '../horizontal-item-list/horizontal-item-list.module';
import { MediaMoviesPage } from './media-movies.page';


@NgModule({
    declarations: [
      MediaMoviesPage
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      HorizontalItemListPageModule
    ],
    exports: [MediaMoviesPage]
})
export class MediaMoviesPageModule {
}
