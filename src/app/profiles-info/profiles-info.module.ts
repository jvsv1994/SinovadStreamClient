import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { ProfilesInfoPage } from './profiles-info.page';

@NgModule({
    declarations: [
        ProfilesInfoPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    exports: [ProfilesInfoPage]
})
export class ProfilesInfoPageModule {
}
