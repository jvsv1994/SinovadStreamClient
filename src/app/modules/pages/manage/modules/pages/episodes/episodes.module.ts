import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EpisodeListPage } from './components/episode-list/episode-list.page';
import { EpisodeFormPage } from './components/episode-form/episode-form.page';
import { EpisodeListModalPage } from './components/episode-list-modal/episode-list-modal.page';
import { EpisodeRangeModalPage } from './components/episode-range-modal/episode-range-modal.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

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
