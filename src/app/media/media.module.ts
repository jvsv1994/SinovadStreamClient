import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HorizontalItemListPage } from './horizontal-item-list/horizontal-item-list.page';
import { MediaDetailComponent } from './detail/media-detail.component';
import { ItemViewPage } from './item-view/item-view.page';
import { MediaItemsComponent } from './items/media-items.component';


@NgModule({
    declarations: [
      MediaItemsComponent,HorizontalItemListPage,MediaDetailComponent,ItemViewPage
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule
    ],
    exports: [MediaItemsComponent,HorizontalItemListPage,MediaDetailComponent,ItemViewPage]
})
export class MediaModule {
}
