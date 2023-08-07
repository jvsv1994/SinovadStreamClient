import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HorizontalItemListPageModule } from '../horizontal-item-list/horizontal-item-list.module';
import { MediaMoviesPage } from './media-movies/media-movies.page';
import { MediaTvSeriesPage } from './media-tvseries/media-tvseries.page';


@NgModule({
    declarations: [
      MediaMoviesPage,MediaTvSeriesPage
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      HorizontalItemListPageModule
    ],
    exports: [MediaMoviesPage,MediaTvSeriesPage]
})
export class MediaModule {
}
