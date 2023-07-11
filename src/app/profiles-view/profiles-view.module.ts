import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfilesViewPage } from './profiles-view.page';
import { SharedModule } from 'src/shared.module';
import { ProfilesInfoPageModule } from '../profiles-info/profiles-info.module';
import { ProfileFormPageModule } from '../profile-form/profile-form.module';

@NgModule({
    declarations: [
        ProfilesViewPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        ProfilesInfoPageModule,
        ProfileFormPageModule
    ],
    exports: [ProfilesViewPage]
})
export class ProfilesViewPageModule {
}
