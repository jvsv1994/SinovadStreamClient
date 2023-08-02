import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EpisodeListPageModule } from '../episode-list/episode-list.module';
import { SharedModule } from '../shared/shared.module';
import { EpisodeListModalPage } from './episode-list-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    EpisodeListPageModule,
  ],
  declarations: [EpisodeListModalPage],
  exports: [EpisodeListModalPage]
})
export class EpisodeListModalPageModule {}
