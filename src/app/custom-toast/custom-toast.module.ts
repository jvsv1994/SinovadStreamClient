import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
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
