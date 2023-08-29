import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { UserListPage } from './user-list/user-list.page';
import { MediaServersModule } from '../servers/servers.module';

@NgModule({
    declarations: [
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
