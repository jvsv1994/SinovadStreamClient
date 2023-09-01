import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilesRoutingModule } from './profiles-routing.module';
import { ProfilesViewPage } from './profiles-view/profiles-view.page';
import { ProfileNewPage } from './profile-new/profile-new.page';
import { ProfileEditPage } from './profile-edit/profile-edit.page';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
