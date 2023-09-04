import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediaRoutingModule } from './media-routing.module';
import { ServerItemsComponent } from './components/server-items/server-items.component';
import { LibraryItemsComponent } from './components/library-items/library-items.component';
import { SharedModule } from '../../shared/shared.module';
import { ItemVideoComponent } from './components/item-video/item-video.component';
import { ItemDetailComponent } from './components/item-detail/item-detail.component';


@NgModule({
  declarations: [ServerItemsComponent,LibraryItemsComponent,ItemDetailComponent,ItemVideoComponent],
  imports: [
    CommonModule,
    SharedModule,
    MediaRoutingModule
  ],
  exports:[ServerItemsComponent,LibraryItemsComponent,ItemDetailComponent,ItemVideoComponent]
})
export class MediaModule { }
