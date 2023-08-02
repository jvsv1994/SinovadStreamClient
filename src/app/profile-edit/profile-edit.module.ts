import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ProfileEditPage } from './profile-edit.page';

@NgModule({
    declarations: [
        ProfileEditPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    exports: [ProfileEditPage]
})
export class ProfileEditPageModule {
}
