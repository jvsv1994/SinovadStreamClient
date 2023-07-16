import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { ProfilesViewTvPage } from './profiles-view-tv.page';
import { ProfileFormTvPageModule } from '../profile-form-tv/profile-form-tv.module';

@NgModule({
    declarations: [
        ProfilesViewTvPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        ProfileFormTvPageModule
    ],
    exports: [ProfilesViewTvPage]
})
export class ProfilesViewTvPageModule {
}
