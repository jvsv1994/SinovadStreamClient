import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfilesViewPage } from './profiles-view.page';
import { SharedModule } from 'src/shared.module';
import { ProfileFormPageModule } from '../profile-form/profile-form.module';
import { ProfileNewPageModule } from '../profile-new/profile-new.module';

@NgModule({
    declarations: [
        ProfilesViewPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        ProfileFormPageModule,
        ProfileNewPageModule
    ],
    exports: [ProfilesViewPage]
})
export class ProfilesViewPageModule {
}
