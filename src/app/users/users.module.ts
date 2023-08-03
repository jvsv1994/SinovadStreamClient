import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { UsersComponent } from './users.component';
import { UserListPage } from './user-list/user-list.page';
import { ContextMenuPageModule } from '../context-menu/context-menu.module';
import { MediaServerListModalPageModule } from '../media-server-list-modal/media-server-list-modal.module';

@NgModule({
    declarations: [
      UsersComponent,
      UserListPage
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      ContextMenuPageModule,
      MediaServerListModalPageModule
    ],
    exports: [UserListPage]
})
export class UsersModule {
}
