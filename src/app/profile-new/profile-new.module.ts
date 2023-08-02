import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ProfileNewPage } from './profile-new.page';

@NgModule({
    declarations: [
      ProfileNewPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    exports: [ProfileNewPage]
})
export class ProfileNewPageModule {
}
