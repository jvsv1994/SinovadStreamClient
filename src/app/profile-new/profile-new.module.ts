import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
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
