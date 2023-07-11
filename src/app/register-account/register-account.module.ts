import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterAccountPage } from './register-account.page';
import { SharedModule } from 'src/shared.module';

@NgModule({
    declarations: [
      RegisterAccountPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [RegisterAccountPage]
})
export class RegisterAcccountPageModule {
}
