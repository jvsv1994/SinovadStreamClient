import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GenreFormPage } from './components/genre-form/genre-form.page';
import { GenresSelectionModalComponent } from './components/genres-selection-modal/genres-selection-modal.component';
import { GenreListPage } from './components/genre-list/genre-list.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

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
