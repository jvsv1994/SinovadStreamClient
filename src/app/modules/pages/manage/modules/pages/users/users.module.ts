import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MediaServersModule } from '../servers/servers.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { UserListComponent } from './components/user-list/user-list.component';
import { UsersRoutingModule } from './users-routing.module';
import { UserRolesComponent } from './components/user-roles/user-roles.component';

@NgModule({
    declarations: [
      UserListComponent,UserRolesComponent
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      UsersRoutingModule,
      SharedModule,
      MediaServersModule
    ],
    exports: [UserListComponent]
})
export class UsersModule {
}
