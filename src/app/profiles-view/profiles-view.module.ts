import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfilesViewPage } from './profiles-view.page';
import { SharedModule } from 'src/shared.module';
import { ProfileNewPageModule } from '../profile-new/profile-new.module';
import { ProfileEditPageModule } from '../profile-edit/profile-edit.module';

@NgModule({
    declarations: [
        ProfilesViewPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        ProfileEditPageModule,
        ProfileNewPageModule
    ],
    exports: [ProfilesViewPage]
})
export class ProfilesViewPageModule {
}
