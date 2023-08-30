import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ConfirmEmailPage } from './confirm-email.page';

@NgModule({
    declarations: [
      ConfirmEmailPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [ConfirmEmailPage]
})
export class ConfirmEmailPageModule {
}
