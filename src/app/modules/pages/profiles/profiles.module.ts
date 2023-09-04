import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilesRoutingModule } from './profiles-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfilesViewComponent } from './components/profiles-view/profiles-view.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { ProfileNewComponent } from './components/profile-new/profile-new.component';

@NgModule({
  declarations: [ProfilesViewComponent,
    ProfileEditComponent,
    ProfileNewComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    ProfilesRoutingModule
  ],
  exports: [ProfilesViewComponent,ProfileEditComponent,ProfileNewComponent]
})
export class ProfilesModule { }
