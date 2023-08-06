import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { DropDownUserPage } from './dropdown-user.page';

@NgModule({
    declarations: [
      DropDownUserPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [DropDownUserPage]
})
export class DropDownUserPageModule {
}
