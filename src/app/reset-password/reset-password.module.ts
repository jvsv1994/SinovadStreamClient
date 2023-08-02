import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ResetPasswordPage } from './reset-password.page';
import { CustomSpinnerPageModule } from '../custom-spinner/custom-spinner.module';
@NgModule({
    declarations: [
      ResetPasswordPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        CustomSpinnerPageModule
    ],
    exports: [ResetPasswordPage]
})
export class ResetPasswordPageModule {
}
