import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { MyAccountPageComponent } from './components/my-account/my-account-page.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ChangeUsernameComponent } from './components/change-username/change-username.component';
import { ChangeNamesComponent } from './components/change-names/change-names.component';
import { SetPasswordComponent } from './components/set-password/set-password.component';

@NgModule({
    declarations: [
      MyAccountPageComponent,ChangePasswordComponent,SetPasswordComponent,ChangeUsernameComponent,ChangeNamesComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [MyAccountPageComponent,ChangePasswordComponent,SetPasswordComponent,ChangeUsernameComponent,ChangeNamesComponent]
})
export class AccountSettingsModule {
}
