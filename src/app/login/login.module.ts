import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPage } from './login.page';
import { SharedModule } from 'src/shared.module';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    declarations: [
      LoginPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [LoginPage]
})
export class LoginPageModule {
}
