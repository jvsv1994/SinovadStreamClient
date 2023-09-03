import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { RecoverPasswordComponent } from './components/recover-password.component';

@NgModule({
    declarations: [
      RecoverPasswordComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [RecoverPasswordComponent]
})
export class RecoverPasswordPageModule {
}
