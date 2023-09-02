import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyAccountPage } from './components/my-account/my-account.page';
import { ChangePasswordPage } from './components/change-password/change-password.page';
import { SetPasswordPage } from './components/set-password/set-password.page';
import { ChangeUsernamePage } from './components/change-username/change-username.page';
import { ChangeNamesPage } from './components/change-names/change-names.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
    declarations: [
      MyAccountPage,ChangePasswordPage,SetPasswordPage,ChangeUsernamePage,ChangeNamesPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [MyAccountPage,ChangePasswordPage,SetPasswordPage,ChangeUsernamePage,ChangeNamesPage]
})
export class AccountSettingsModule {
}