import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';

@NgModule({
    declarations: [
      ConfirmEmailComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [ConfirmEmailComponent]
})
export class ConfirmEmailPageModule {
}
