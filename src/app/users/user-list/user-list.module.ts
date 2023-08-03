import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserListPage } from './user-list.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaginationPageModule } from 'src/app/pagination/pagination.module';
import { ContextMenuPageModule } from 'src/app/context-menu/context-menu.module';
import { MediaServerListModalPageModule } from 'src/app/media-server-list-modal/media-server-list-modal.module';

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
