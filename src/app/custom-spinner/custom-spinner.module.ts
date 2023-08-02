import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CustomSpinnerPage } from './custom-spinner.page';
@NgModule({
    declarations: [
      CustomSpinnerPage
    ],
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [CustomSpinnerPage]
})
export class CustomSpinnerPageModule {
}
