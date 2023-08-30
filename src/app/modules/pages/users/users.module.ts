import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserListPage } from './user-list/user-list.page';
import { MediaServersModule } from '../servers/servers.module';
import { SharedModule } from '../../shared/shared.module';

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
