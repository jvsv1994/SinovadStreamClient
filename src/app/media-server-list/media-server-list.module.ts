import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { PaginationPageModule } from '../pagination/pagination.module';
import { SeasonFormPageModule } from '../season-form/season-form.module';
import { EpisodeListModalPageModule } from '../episode-list-modal/episode-list-modal.module';
import { ConfirmMessageModalPageModule } from '../confirm-message-modal/confirm-message-modal.module';
import { ContextMenuPageModule } from '../context-menu/context-menu.module';
import { MediaServerListPage } from './media-server-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    EpisodeListModalPageModule,
    PaginationPageModule,
    SeasonFormPageModule,
    ConfirmMessageModalPageModule,
    ContextMenuPageModule
  ],
  declarations: [MediaServerListPage],
  exports: [MediaServerListPage]
})
export class MediaServerListPageModule {}
