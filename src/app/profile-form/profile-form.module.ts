import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { ProfilesInfoPageModule } from '../profiles-info/profiles-info.module';
import { ProfileFormPage } from './profile-form.page';

@NgModule({
    declarations: [
        ProfileFormPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        ProfilesInfoPageModule
    ],
    exports: [ProfileFormPage]
})
export class ProfileFormPageModule {
}
