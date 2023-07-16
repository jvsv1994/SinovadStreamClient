import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
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
    ],
    exports: [ProfileFormTvPage]
})
export class ProfileFormTvPageModule {
}
