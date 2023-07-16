import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { ProfilesInfoPageModule } from '../profiles-info/profiles-info.module';
import { ProfileFormPageModule } from '../profile-form/profile-form.module';
import { ProfilesViewTvPage } from './profiles-view-tv.page';

@NgModule({
    declarations: [
        ProfilesViewTvPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        ProfilesInfoPageModule,
        ProfileFormPageModule
    ],
    exports: [ProfilesViewTvPage]
})
export class ProfilesViewTvPageModule {
}
