import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MediaServersModule } from '../media-servers/media-servers.module';
import { MovieListPage } from './movie-list/movie-list.page';
import { MovieFormPage } from './movie-form/movie-form.page';
import { ItemGenresPageModule } from '../item-genres/item-genres.module';

@NgModule({
    declarations: [
      MovieListPage,MovieFormPage
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      MediaServersModule,
      ItemGenresPageModule
    ],
    exports: [MovieListPage,MovieFormPage]
})
export class MoviesModule {
}
