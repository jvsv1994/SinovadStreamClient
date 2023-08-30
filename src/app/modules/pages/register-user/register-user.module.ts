import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterUserPage } from './register-user.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    declarations: [
      RegisterUserPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [RegisterUserPage]
})
export class RegisterAcccountPageModule {
}
