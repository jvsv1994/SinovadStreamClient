import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { RecoverPasswordPage } from './recover-password.page';

@NgModule({
    declarations: [
      RecoverPasswordPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [RecoverPasswordPage]
})
export class RecoverPasswordPageModule {
}
