import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ItemViewPage } from './item-view/item-view.page';
import { MovieDetailPage } from './movie-detail/movie-detail.page';
import { TvSerieDetailPage } from './tvserie-detail/tvserie-detail.page';

@NgModule({
    declarations: [
      ItemViewPage,MovieDetailPage,TvSerieDetailPage
    ],
    providers:[],
    imports: [
      FormsModule,
      SharedModule,
      RouterModule
    ],
    exports: [ItemViewPage,MovieDetailPage,TvSerieDetailPage]
})
export class MediaDetailModule {
}
