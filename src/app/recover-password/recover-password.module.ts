import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { RecoverPasswordPage } from './recover-password.page';
import { CustomSpinnerPageModule } from '../custom-spinner/custom-spinner.module';

@NgModule({
    declarations: [
      RecoverPasswordPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        CustomSpinnerPageModule
    ],
    exports: [RecoverPasswordPage]
})
export class RecoverPasswordPageModule {
}
