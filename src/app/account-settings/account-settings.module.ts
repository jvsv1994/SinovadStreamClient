import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MyAccountPage } from './my-account/my-account.page';
import { ChangePasswordPage } from './change-password/change-password.page';
import { SetPasswordPage } from './set-password/set-password.page';

@NgModule({
    declarations: [
      MyAccountPage,ChangePasswordPage,SetPasswordPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [MyAccountPage,ChangePasswordPage,SetPasswordPage]
})
export class AccountSettingsModule {
}
