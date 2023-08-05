import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { EpisodeListModalPage } from './episode-list-modal/episode-list-modal.page';
import { EpisodeListPage } from './episode-list/episode-list.page';
import { EpisodeFormPage } from './episode-form/episode-form.page';
import { EpisodeRangeModalPage } from './episode-range-modal/episode-range-modal.page';

@NgModule({
    declarations: [
      EpisodeListPage,
      EpisodeListModalPage,
      EpisodeFormPage,
      EpisodeRangeModalPage
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule
    ],
    exports: [EpisodeListPage,EpisodeListModalPage,EpisodeFormPage,EpisodeRangeModalPage]
})
export class EpisodesModule {
}
