import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { UsersComponent } from './users.component';
import { UserListPage } from './user-list/user-list.page';
import { MediaServersModule } from '../media-servers/media-servers.module';

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
      MediaServersModule
    ],
    exports: [UserListPage]
})
export class UsersModule {
}
