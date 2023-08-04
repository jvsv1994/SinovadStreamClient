import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { GenreListPage } from './genre-list/genre-list.page';
import { GenreFormPage } from './genre-form/genre-form.page';

@NgModule({
    declarations: [
      GenreListPage,GenreFormPage
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule
    ],
    exports: [GenreListPage,GenreFormPage]
})
export class GenresModule {
}
