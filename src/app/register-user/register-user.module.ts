import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterUserPage } from './register-user.page';
import { SharedModule } from 'src/shared.module';
import { CustomSpinnerPageModule } from '../custom-spinner/custom-spinner.module';

@NgModule({
    declarations: [
      RegisterUserPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        CustomSpinnerPageModule
    ],
    exports: [RegisterUserPage]
})
export class RegisterAcccountPageModule {
}
