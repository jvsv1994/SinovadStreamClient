import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { SuccessMessageModalPage } from './success-message-modal.page';

@NgModule({
    declarations: [
        SuccessMessageModalPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [SuccessMessageModalPage]
})
export class SuccessMessageModalPageModule {
}
