import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loggedUserGuard } from 'src/app/guards/logged-user.guard';
import { ProfilesViewComponent } from './components/profiles-view/profiles-view.component';
import { ProfileNewComponent } from './components/profile-new/profile-new.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';

const routes: Routes = [
  {
  path: '',
  component: ProfilesViewComponent,
  canActivate:[loggedUserGuard]
},
{
  path: 'add',
  component: ProfileNewComponent,
  canActivate:[loggedUserGuard]
},
{
  path: 'edit/:profileGuid',
  component: ProfileEditComponent,
  canActivate:[loggedUserGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilesRoutingModule { }
