import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { ProfilesInfoPageModule } from '../profiles-info/profiles-info.module';
import { ProfileFormTvPage } from './profile-form-tv.page';

@NgModule({
    declarations: [
        ProfileFormTvPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        ProfilesInfoPageModule
    ],
    exports: [ProfileFormTvPage]
})
export class ProfileFormTvPageModule {
}
