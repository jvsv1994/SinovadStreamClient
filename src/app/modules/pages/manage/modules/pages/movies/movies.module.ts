import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MovieListPage } from './components/movie-list/movie-list.page';
import { MovieFormPage } from './components/movie-form/movie-form.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

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
