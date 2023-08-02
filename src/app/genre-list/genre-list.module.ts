import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PaginationPageModule } from '../pagination/pagination.module';
import { ContextMenuPageModule } from '../context-menu/context-menu.module';
import { GenreListPage } from './genre-list.page';

@NgModule({
    declarations: [
      GenreListPage
    ],
    providers:[],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      PaginationPageModule,
      ContextMenuPageModule
    ],
    exports: [GenreListPage]
})
export class GenreListPageModule {
}
