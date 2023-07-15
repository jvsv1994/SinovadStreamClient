import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { PaginationPageModule } from '../pagination/pagination.module';
import { ContextMenuPageModule } from '../context-menu/context-menu.module';
import { MenuFormPageModule } from '../menu-form/menu-form.module';
import { UserListPage } from './user-list.page';

@NgModule({
    declarations: [
      UserListPage
    ],
    providers:[],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      PaginationPageModule,
      ContextMenuPageModule,
      MenuFormPageModule
    ],
    exports: [UserListPage]
})
export class UserListPageModule {
}
