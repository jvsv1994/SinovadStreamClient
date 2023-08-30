import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { GenreListPage } from './genre-list/genre-list.page';
import { GenreFormPage } from './genre-form/genre-form.page';
import { GenresSelectionModalComponent } from './genres-selection-modal/genres-selection-modal.component';

@NgModule({
    declarations: [
      GenreListPage,GenreFormPage,GenresSelectionModalComponent
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule
    ],
    exports: [GenreListPage,GenreFormPage,GenresSelectionModalComponent]
})
export class GenresModule {
}
