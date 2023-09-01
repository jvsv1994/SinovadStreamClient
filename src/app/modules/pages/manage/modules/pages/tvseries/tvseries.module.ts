import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeasonsModule } from '../seasons/seasons.module';
import { TvSerieFormPage } from './components/tvserie-form/tvserie-form.page';
import { TvSerieListPage } from './components/tvserie-list/tvserie-list.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
    declarations: [
      TvSerieListPage,TvSerieFormPage
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      SeasonsModule
    ],
    exports: [TvSerieListPage,TvSerieFormPage]
})
export class TvSeriesModule {
}
