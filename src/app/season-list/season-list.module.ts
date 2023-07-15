import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeasonListPage } from './season-list.page';
import { SharedModule } from 'src/shared.module';
import { PaginationPageModule } from '../pagination/pagination.module';
import { SeasonFormPageModule } from '../season-form/season-form.module';
import { EpisodeListModalPageModule } from '../episode-list-modal/episode-list-modal.module';
import { ConfirmMessageModalPageModule } from '../confirm-message-modal/confirm-message-modal.module';
import { ContextMenuPageModule } from '../context-menu/context-menu.module';

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
  declarations: [SeasonListPage],
  exports: [SeasonListPage]
})
export class SeasonListPageModule {}
