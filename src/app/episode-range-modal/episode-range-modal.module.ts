import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ItemGenresPageModule } from '../item-genres/item-genres.module';
import { EpisodeRangeModalPage } from './episode-range-modal.page';

@NgModule({
    declarations: [
      EpisodeRangeModalPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        ItemGenresPageModule
    ],
    exports: [EpisodeRangeModalPage]
})
export class EpisodeRangeModalPageModule {
}
