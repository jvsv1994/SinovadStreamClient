import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilesRoutingModule } from './profiles-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfilesViewPage } from './components/profiles-view/profiles-view.page';
import { ProfileEditPage } from './components/profile-edit/profile-edit.page';
import { ProfileNewPage } from './components/profile-new/profile-new.page';

@NgModule({
  declarations: [ProfilesViewPage,
    ProfileEditPage,
    ProfileNewPage],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    ProfilesRoutingModule
  ],
  exports: [ProfilesViewPage,ProfileEditPage,ProfileNewPage]
})
export class ProfilesModule { }
