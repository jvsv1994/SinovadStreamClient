import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AccountPage } from './account.page';
import { ChangePasswordPageModule } from '../change-password/change-password.module';

@NgModule({
    declarations: [
      AccountPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        ChangePasswordPageModule
    ],
    exports: [AccountPage]
})
export class AccountPageModule {
}
