import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ProfilesViewPage } from './profiles-view/profiles-view.page';
import { ProfileEditPage } from './profile-edit/profile-edit.page';
import { ProfileNewPage } from './profile-new/profile-new.page';

@NgModule({
    declarations: [
      ProfilesViewPage,
      ProfileEditPage,
      ProfileNewPage
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule
    ],
    exports: [ProfilesViewPage,ProfileEditPage,ProfileNewPage]
})
export class ProfilesModule {
}
