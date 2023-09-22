import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loggedUserGuard } from 'src/app/guards/logged-user.guard';
import { mainAdminGuard } from 'src/app/guards/main-admin.guard';
import { RoleListComponent } from './components/role-list/role-list.component';

const routes: Routes = [
  {
    path:"",
    component:RoleListComponent,
    canActivate:[loggedUserGuard,mainAdminGuard]
  },
  {
    path:":roleId/menus",
    component:RoleListComponent,
    canActivate:[loggedUserGuard,mainAdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
