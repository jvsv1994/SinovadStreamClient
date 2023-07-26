import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { CustomToastPage } from './custom-toast.page';
@NgModule({
    declarations: [
      CustomToastPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [CustomToastPage]
})
export class CustomToastPageModule {
}
