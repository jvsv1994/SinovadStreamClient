import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CustomActionsMenuPage } from './custom-actions-menu.page';
@NgModule({
    declarations: [
      CustomActionsMenuPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [CustomActionsMenuPage]
})
export class CustomActionsMenuPageModule {
}
