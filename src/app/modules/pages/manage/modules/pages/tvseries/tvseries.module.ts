import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeasonsModule } from '../seasons/seasons.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { TvSerieListComponent } from './components/tvserie-list/tvserie-list.component';
import { TvSerieFormComponent } from './components/tvserie-form/tvserie-form.component';

@NgModule({
    declarations: [
      TvSerieListComponent,TvSerieFormComponent
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      SeasonsModule
    ],
    exports: [TvSerieListComponent,TvSerieFormComponent]
})
export class TvSeriesModule {
}
