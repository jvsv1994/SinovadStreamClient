import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { LibraryListComponent } from './library-list/library-list.component';
import { LibraryFormComponent } from './library-form/library-form.component';

@NgModule({
    declarations: [
      LibraryListComponent,LibraryFormComponent
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule
    ],
    exports: [LibraryListComponent,LibraryFormComponent]
})
export class LibrariesModule {
}
