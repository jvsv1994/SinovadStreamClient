import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SeasonListModalPage } from './season-list-modal/season-list-modal.page';
import { SeasonListPage } from './season-list/season-list.page';
import { SeasonFormPage } from './season-form/season-form.page';
import { EpisodesModule } from '../episodes/episodes.module';

@NgModule({
    declarations: [
      SeasonListPage,
      SeasonListModalPage,
      SeasonFormPage
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      EpisodesModule
    ],
    exports: [SeasonListPage,SeasonListModalPage,SeasonFormPage]
})
export class SeasonsModule {
}
