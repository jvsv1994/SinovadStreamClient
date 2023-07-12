import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared.module';
import { ProfilesViewPageModule } from '../profiles-view/profiles-view.module';
import { DropDownUserPage } from './dropdown-account.page';

@NgModule({
    declarations: [
      DropDownUserPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        ProfilesViewPageModule
    ],
    exports: [DropDownUserPage]
})
export class DropDownUserPageModule {
}
