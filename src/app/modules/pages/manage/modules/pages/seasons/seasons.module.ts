import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EpisodesModule } from '../episodes/episodes.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { SeasonListComponent } from './components/season-list/season-list.component';
import { SeasonListModalComponent } from './components/season-list-modal/season-list-modal.component';
import { SeasonFormComponent } from './components/season-form/season-form.component';

@NgModule({
    declarations: [
      SeasonListComponent,
      SeasonListModalComponent,
      SeasonFormComponent
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      EpisodesModule
    ],
    exports: [SeasonListComponent,SeasonListModalComponent,SeasonFormComponent]
})
export class SeasonsModule {
}
