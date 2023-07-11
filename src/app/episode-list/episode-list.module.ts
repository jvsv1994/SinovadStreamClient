import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EpisodeListPage } from './episode-list.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/shared.module';
import { PaginationPageModule } from '../pagination/pagination.module';
import { EpisodeFormPageModule } from '../episode-form/episode-form.module';
import { EpisodeRangeModalPageModule } from '../episode-range-modal/episode-range-modal.module';
import { ConfirmMessageModalPageModule } from '../confirm-message-modal/confirm-message-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    PaginationPageModule,
    EpisodeFormPageModule,
    EpisodeRangeModalPageModule,
    ConfirmMessageModalPageModule
  ],
  declarations: [EpisodeListPage],
  exports: [EpisodeListPage]
})
export class EpisodeListPageModule {}
