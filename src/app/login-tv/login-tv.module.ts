import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { LoginTvPage } from './login-tv.page';

@NgModule({
    declarations: [
      LoginTvPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [LoginTvPage]
})
export class LoginTvPageModule {
}
