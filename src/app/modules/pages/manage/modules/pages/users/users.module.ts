import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MediaServersModule } from '../servers/servers.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { UserListComponent } from './components/user-list/user-list.component';

@NgModule({
    declarations: [
      UserListComponent
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      MediaServersModule
    ],
    exports: [UserListComponent]
})
export class UsersModule {
}
