import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MovieListPage } from './movie-list/movie-list.page';
import { MovieFormPage } from './movie-form/movie-form.page';

@NgModule({
    declarations: [
      MovieListPage,MovieFormPage
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule
    ],
    exports: [MovieListPage,MovieFormPage]
})
export class MoviesModule {
}
