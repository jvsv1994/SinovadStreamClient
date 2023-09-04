import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GenresSelectionModalComponent } from './components/genres-selection-modal/genres-selection-modal.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { GenreListComponent } from './components/genre-list/genre-list.component';
import { GenreFormComponent } from './components/genre-form/genre-form.component';

@NgModule({
    declarations: [
      GenreListComponent,GenreFormComponent,GenresSelectionModalComponent
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule
    ],
    exports: [GenreListComponent,GenreFormComponent,GenresSelectionModalComponent]
})
export class GenresModule {
}
