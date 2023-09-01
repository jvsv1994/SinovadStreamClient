import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MediaServersModule } from '../servers/servers.module';
import { UserListPage } from './components/user-list/user-list.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

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
