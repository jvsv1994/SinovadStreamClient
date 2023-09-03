import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { RegisterUserComponent } from './components/register-user/register-user.component';

@NgModule({
    declarations: [
      RegisterUserComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [RegisterUserComponent]
})
export class RegisterAcccountPageModule {
}
