import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MediaMoviesPage } from './media-movies/media-movies.page';
import { MediaTvSeriesPage } from './media-tvseries/media-tvseries.page';
import { HorizontalItemListPage } from './horizontal-item-list/horizontal-item-list.page';
import { HomePage } from './home/home.page';


@NgModule({
    declarations: [
      HomePage,MediaMoviesPage,MediaTvSeriesPage,HorizontalItemListPage
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule
    ],
    exports: [HomePage,MediaMoviesPage,MediaTvSeriesPage,HorizontalItemListPage]
})
export class MediaModule {
}
