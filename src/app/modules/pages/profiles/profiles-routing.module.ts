import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loggedUserGuard } from 'src/app/guards/logged-user.guard';
import { ProfilesViewPage } from './components/profiles-view/profiles-view.page';
import { ProfileNewPage } from './components/profile-new/profile-new.page';
import { ProfileEditPage } from './components/profile-edit/profile-edit.page';

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
