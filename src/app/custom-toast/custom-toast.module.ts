import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/shared.module';
import { CustomToastPage } from './custom-toast.page';
@NgModule({
    declarations: [
      CustomToastPage
    ],
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [CustomToastPage]
})
export class CustomToastPageModule {
}
