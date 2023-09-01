import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EpisodesModule } from '../episodes/episodes.module';
import { SeasonFormPage } from './components/season-form/season-form.page';
import { SeasonListModalPage } from './components/season-list-modal/season-list-modal.page';
import { SeasonListPage } from './components/season-list/season-list.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

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
