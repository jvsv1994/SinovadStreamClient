import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPage } from './login.page';
import { SharedModule } from 'src/shared.module';
import { CustomSpinnerPageModule } from '../custom-spinner/custom-spinner.module';

@NgModule({
    declarations: [
      LoginPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        CustomSpinnerPageModule
    ],
    exports: [LoginPage]
})
export class LoginPageModule {
}
