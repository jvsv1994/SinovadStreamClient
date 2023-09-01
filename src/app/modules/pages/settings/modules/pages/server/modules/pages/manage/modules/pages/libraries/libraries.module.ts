import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LibraryListComponent } from './components/library-list/library-list.component';
import { LibraryFormComponent } from './components/library-form/library-form.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';

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
