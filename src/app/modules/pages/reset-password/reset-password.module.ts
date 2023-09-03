import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
@NgModule({
    declarations: [
      ResetPasswordComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [ResetPasswordComponent]
})
export class ResetPasswordPageModule {
}
