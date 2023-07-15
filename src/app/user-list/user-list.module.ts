import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { PaginationPageModule } from '../pagination/pagination.module';
import { ContextMenuPageModule } from '../context-menu/context-menu.module';
import { UserListPage } from './user-list.page';
import { MediaServerListModalPageModule } from '../media-server-list-modal/media-server-list-modal.module';

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
      MediaServerListModalPageModule
    ],
    exports: [UserListPage]
})
export class UserListPageModule {
}
