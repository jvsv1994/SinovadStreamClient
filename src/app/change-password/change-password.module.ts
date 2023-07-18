import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { ChangePasswordPage } from './change-password.page';

@NgModule({
    declarations: [
      ChangePasswordPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [ChangePasswordPage]
})
export class ChangePasswordPageModule {
}
