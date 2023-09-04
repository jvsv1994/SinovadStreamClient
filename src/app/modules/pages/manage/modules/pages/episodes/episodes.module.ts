import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { EpisodeListComponent } from './components/episode-list/episode-list.component';
import { EpisodeListModalComponent } from './components/episode-list-modal/episode-list-modal.component';
import { EpisodeFormComponent } from './components/episode-form/episode-form.component';
import { EpisodeRangeModalComponent } from './components/episode-range-modal/episode-range-modal.component';

@NgModule({
    declarations: [
      EpisodeListComponent,
      EpisodeListModalComponent,
      EpisodeFormComponent,
      EpisodeRangeModalComponent
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule
    ],
    exports: [EpisodeListComponent,EpisodeListModalComponent,EpisodeFormComponent,EpisodeRangeModalComponent]
})
export class EpisodesModule {
}
