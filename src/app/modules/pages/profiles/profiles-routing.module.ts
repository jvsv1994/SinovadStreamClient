import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileEditPage } from './profile-edit/profile-edit.page';
import { loggedUserGuard } from 'src/app/guards/logged-user.guard';
import { ProfileNewPage } from './profile-new/profile-new.page';
import { ProfilesViewPage } from './profiles-view/profiles-view.page';

const routes: Routes = [
  {
  path: '',
  component: ProfilesViewPage,
  canActivate:[loggedUserGuard]
},
{
  path: 'add',
  component: ProfileNewPage,
  canActivate:[loggedUserGuard]
},
{
  path: 'edit/:profileGuid',
  component: ProfileEditPage,
  canActivate:[loggedUserGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilesRoutingModule { }
