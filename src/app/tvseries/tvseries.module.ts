import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TvSerieListPage } from './tvserie-list/tvserie-list.page';
import { TvSerieFormPage } from './tvserie-form/tvserie-form.page';

@NgModule({
    declarations: [
      TvSerieListPage,TvSerieFormPage
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule
    ],
    exports: [TvSerieListPage,TvSerieFormPage]
})
export class TvSeriesModule {
}