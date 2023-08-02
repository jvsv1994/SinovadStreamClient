import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MediaServerListModalPage } from './media-server-list-modal.page';
import { MediaServerListPageModule } from '../media-server-list/media-server-list.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MediaServerListPageModule
  ],
  declarations: [MediaServerListModalPage],
  exports: [MediaServerListModalPage]
})
export class MediaServerListModalPageModule {}
