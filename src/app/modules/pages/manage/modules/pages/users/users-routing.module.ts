import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loggedUserGuard } from 'src/app/guards/logged-user.guard';
import { mainAdminGuard } from 'src/app/guards/main-admin.guard';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserRolesComponent } from './components/user-roles/user-roles.component';

const routes: Routes = [
  {
    path:"",
    component:UserListComponent,
    canActivate:[loggedUserGuard,mainAdminGuard]
  },
  {
    path:":userId/roles",
    component:UserRolesComponent,
    canActivate:[loggedUserGuard,mainAdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
