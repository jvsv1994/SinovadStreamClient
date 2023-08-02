import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EpisodeListPageModule } from '../episode-list/episode-list.module';
import { SharedModule } from '../shared/shared.module';
import { SeasonListModalPage } from './season-list-modal.page';
import { SeasonListPageModule } from '../season-list/season-list.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    EpisodeListPageModule,
    SeasonListPageModule
  ],
  declarations: [SeasonListModalPage],
  exports: [SeasonListModalPage]
})
export class SeasonListModalPageModule {}
